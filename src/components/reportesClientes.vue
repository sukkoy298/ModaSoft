<script setup>
import Header from '@/components/Header.vue'
import { ref, onMounted } from 'vue'
import { obtenerTopClientes, obtenerClientesPorTipo } from '@/reportes.js'

const pestañaActiva = ref('top');
const cargando = ref(false);
const errorConexion = ref(false);

// Datos para Top Clientes
const topClientes = ref([]);

// Datos para Clientes por Tipo
const clientesPorTipo = ref([]);
const filtroTipo = ref('');

// FILTROS DE FECHA
const filtroFechaInicio = ref('');
const filtroFechaFin = ref('');

const cambiarPestaña = (pestaña) => {
    pestañaActiva.value = pestaña;
    cargarDatos();
};

const cargarTopClientes = async () => {
    cargando.value = true;
    errorConexion.value = false;
    try {
        // Pasar los filtros de fecha a la función
        const data = await obtenerTopClientes(10, filtroFechaInicio.value, filtroFechaFin.value);
        topClientes.value = data;
    } catch (error) {
        console.error('Error al cargar top clientes:', error);
        errorConexion.value = true;
    } finally {
        cargando.value = false;
    }
};

const cargarClientesPorTipo = async () => {
    cargando.value = true;
    errorConexion.value = false;
    try {
        // Pasar los filtros de fecha a la función
        const data = await obtenerClientesPorTipo(filtroTipo.value, filtroFechaInicio.value, filtroFechaFin.value);
        clientesPorTipo.value = data;
    } catch (error) {
        console.error('Error al cargar clientes por tipo:', error);
        errorConexion.value = true;
    } finally {
        cargando.value = false;
    }
};

const cargarDatos = () => {
    if (pestañaActiva.value === 'top') {
        cargarTopClientes();
    } else {
        cargarClientesPorTipo();
    }
};

// Función para limpiar filtros de fecha
const limpiarFiltrosFecha = () => {
    filtroFechaInicio.value = '';
    filtroFechaFin.value = '';
    cargarDatos();
};

// Función para establecer rango de fecha (últimos 7 días, 30 días, etc.)
const establecerRangoFecha = (dias) => {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);
    
    filtroFechaInicio.value = fechaInicio.toISOString().split('T')[0];
    filtroFechaFin.value = fechaFin.toISOString().split('T')[0];
    cargarDatos();
};

// Función segura para acceder a los datos
const obtenerValor = (objeto, propiedad) => {
    if (!objeto) return 0;
    return objeto.dataValues ? objeto.dataValues[propiedad] : objeto[propiedad] || 0;
};

const formatearMoneda = (valor) => {
    if (!valor) return '$0.00';
    return `$${parseFloat(valor).toFixed(2)}`;
};

const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    try {
        const fechaObj = new Date(fecha);
        fechaObj.setHours(fechaObj.getHours() + 4);
        return fechaObj.toLocaleDateString('es-VE');
    } catch (error) {
        return 'Fecha inválida';
    }
};

onMounted(() => {
    establecerRangoFecha(30);
});
</script>

<template>
    <Header />
    <div class="container mt-5">
        <h1 class="text-center mb-4"> <i class="bi bi-clipboard-data text-danger"></i>Reportes de Clientes</h1>
        
        <div class="card mb-4">
            <div class="card-body">
                <h6 class="card-title mb-3">
                    <i class="bi bi-calendar-range"></i> Filtros de Fecha
                </h6>
                <div class="row g-3 align-items-end">
                    <div class="col-md-3">
                        <label class="form-label">Fecha Inicio:</label>
                        <input 
                            type="date" 
                            v-model="filtroFechaInicio" 
                            class="form-control"
                        >
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Fecha Fin:</label>
                        <input 
                            type="date" 
                            v-model="filtroFechaFin" 
                            class="form-control"
                        >
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Rangos Predefinidos:</label>
                        <div class="btn-group w-100" role="group">
                            <button 
                                type="button" 
                                class="btn btn-outline-secondary btn-sm"
                                @click="establecerRangoFecha(7)"
                            >
                                7 días
                            </button>
                            <button 
                                type="button" 
                                class="btn btn-outline-secondary btn-sm"
                                @click="establecerRangoFecha(30)"
                            >
                                30 días
                            </button>
                            <button 
                                type="button" 
                                class="btn btn-outline-secondary btn-sm"
                                @click="establecerRangoFecha(90)"
                            >
                                90 días
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button 
                            @click="limpiarFiltrosFecha" 
                            class="btn btn-outline-danger w-100"
                        >
                            <i class="bi bi-x-circle"></i> Limpiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Pestañas -->
        <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
                <button 
                    class="nav-link" 
                    :class="{ 'active': pestañaActiva === 'top' }"
                    @click="cambiarPestaña('top')"
                >
                    <i class="bi bi-person-vcard-fill"></i> Top Clientes
                </button>
            </li>
            <li class="nav-item">
                <button 
                    class="nav-link" 
                    :class="{ 'active': pestañaActiva === 'por-tipo' }"
                    @click="cambiarPestaña('por-tipo')"
                >
                    <i class="bi bi-person-fill"></i> Clientes por Tipo
                </button>
            </li>
        </ul>

        <!-- Filtros para Clientes por Tipo -->
        <div v-if="pestañaActiva === 'por-tipo'" class="row mb-4">
            <div class="col-md-6">
                <label class="form-label">Filtrar por Tipo:</label>
                <select v-model="filtroTipo" @change="cargarClientesPorTipo" class="form-select">
                    <option value="">Todos los tipos</option>
                    <option value="Natural">Natural</option>
                    <option value="Jurídico">Jurídico</option>
                    <option value="Genérico">Genérico</option>
                </select>
            </div>
            <div class="col-md-6 d-flex align-items-end">
                <button @click="cargarClientesPorTipo" class="btn btn-primary">
                    <i class="bi bi-arrow-clockwise"></i> Actualizar
                </button>
            </div>
        </div>

        <div v-if="cargando" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando reporte...</p>
        </div>

        <div v-else-if="errorConexion" class="alert alert-danger text-center">
            ⚠️ Error de Conexión: No se pudo cargar el reporte.
        </div>

        <!-- Reporte: Top Clientes -->
        <div v-else-if="pestañaActiva === 'top'">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Top 10 Clientes por Volumen de Compras</h5>
                <button @click="cargarTopClientes" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-arrow-clockwise"></i> Actualizar
                </button>
            </div>

            <div v-if="topClientes.length === 0" class="alert alert-info text-center">
                No hay datos de ventas para mostrar en el rango de fecha seleccionado.
            </div>

            <div v-else class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Cliente</th>
                            <th class="text-center">Total Ventas</th>
                            <th class="text-end">Monto Total</th>
                            <th class="text-end">Base Imponible</th>
                            <th class="text-end">IVA</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(cliente, index) in topClientes" :key="cliente.cedula_cliente">
                            <td class="fw-bold">{{ index + 1 }}</td>
                            <td>
                                <div class="fw-bold">{{ cliente.Cliente?.nombre || 'N/A' }}</div>
                                <small class="text-muted">{{ cliente.cedula_cliente }}</small>
                            </td>
                            <td class="text-center">
                                <span class="badge bg-secondary">{{ obtenerValor(cliente, 'total_ventas') }}</span>
                            </td>
                            <td class="text-end fw-bold text-success">
                                {{ formatearMoneda(obtenerValor(cliente, 'monto_total')) }}
                            </td>
                            <td class="text-end">{{ formatearMoneda(obtenerValor(cliente, 'base_imponible')) }}</td>
                            <td class="text-end">{{ formatearMoneda(obtenerValor(cliente, 'total_iva')) }}</td>
                            <td>
                                <span class="badge" :class="{
                                    'bg-primary': cliente.Cliente?.tipo === 'Natural',
                                    'bg-success': cliente.Cliente?.tipo === 'Jurídico', 
                                    'bg-warning': cliente.Cliente?.tipo === 'Genérico'
                                }">
                                    {{ cliente.Cliente?.tipo || 'N/A' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Reporte: Clientes por Tipo -->
        <div v-else-if="pestañaActiva === 'por-tipo'">
            <h5 class="mb-3">Clientes {{ filtroTipo ? `- Tipo: ${filtroTipo}` : '- Todos los Tipos' }}</h5>

            <div v-if="clientesPorTipo.length === 0" class="alert alert-info text-center">
                No hay clientes que coincidan con el filtro.
            </div>

            <div v-else class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Contacto</th>
                            <th>Tipo</th>
                            <th class="text-center">Total Compras</th>
                            <th class="text-end">Monto Total</th>
                            <th>F. Registro</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cliente in clientesPorTipo" :key="cliente.cedula">
                            <td class="fw-bold">{{ cliente.cedula }}</td>
                            <td>{{ cliente.nombre }}</td>
                            <td>
                                <div><small>{{ cliente.email }}</small></div>
                                <div><small class="text-muted">{{ cliente.telefono }}</small></div>
                            </td>
                            <td>
                                <span class="badge" :class="{
                                    'bg-primary': cliente.tipo === 'Natural',
                                    'bg-success': cliente.tipo === 'Jurídico',
                                    'bg-warning': cliente.tipo === 'Genérico'
                                }">
                                    {{ cliente.tipo }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="badge bg-secondary">{{ obtenerValor(cliente, 'total_compras') }}</span>
                            </td>
                            <td class="text-end fw-bold text-success">
                                {{ formatearMoneda(obtenerValor(cliente, 'monto_total_compras')) }}
                            </td>
                            <td>{{ formatearFecha(cliente.fecha_registro) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>