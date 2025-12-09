<template>
    <Header />
    <div class="container moda-main-container mt-5">
        <h1 class="moda-title text-center mb-4">
            <i class="bi bi-clipboard-data moda-icon-danger me-2"></i>
            Centro de Reportes - Clientes
        </h1>

        <!-- Filtros de fecha -->
        <div class="moda-card mb-4">
            <div class="moda-card-body">
                <h6 class="moda-subtitle mb-3">
                    <i class="bi bi-calendar-range me-2"></i> Filtros de Fecha
                </h6>
                <div class="moda-filter-grid">
                    <div class="moda-filter-group">
                        <label class="moda-label">Fecha Inicio:</label>
                        <input type="date" v-model="filtroFechaInicio" class="moda-input">
                    </div>
                    <div class="moda-filter-group">
                        <label class="moda-label">Fecha Fin:</label>
                        <input type="date" v-model="filtroFechaFin" class="moda-input">
                    </div>
                    <div class="moda-filter-group">
                        <label class="moda-label">Rangos Predefinidos:</label>
                        <div class="moda-btn-group" role="group">
                            <button type="button" class="btn moda-btn-outline-secondary"
                                @click="establecerRangoFecha(7)">
                                7 días
                            </button>
                            <button type="button" class="btn moda-btn-outline-secondary"
                                @click="establecerRangoFecha(30)">
                                30 días
                            </button>
                            <button type="button" class="btn moda-btn-outline-secondary"
                                @click="establecerRangoFecha(90)">
                                90 días
                            </button>
                            <div class="moda-filter-group">
                                <button @click="limpiarFiltrosFecha" class="btn moda-btn-outline-danger w-100">
                                    <i class="bi bi-x-circle me-1"></i> Limpiar
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Pestañas estilo Moda -->
        <div class="moda-tabs-container mb-4">
            <div class="moda-tabs">
                <button class="moda-tab" :class="{ 'active': pestañaActiva === 'top' }" @click="cambiarPestaña('top')">
                    <i class="bi bi-trophy me-2"></i> Top 10 Clientes
                </button>
                <button class="moda-tab" :class="{ 'active': pestañaActiva === 'por-tipo' }"
                    @click="cambiarPestaña('por-tipo')">
                    <i class="bi bi-people me-2"></i> Clientes por Tipo
                </button>
            </div>
        </div>

        <!-- Descripción del reporte -->
        <div class="moda-report-description mb-4">
            <p class="moda-subtitle">
                <i class="bi bi-info-circle me-2"></i>
                {{ pestañaActiva === 'top'
                    ? 'Análisis de los 10 clientes con mayor volumen de compras en el período seleccionado'
                    : 'Segmentación de clientes según tipo para análisis de comportamiento y compras'
                }}
            </p>
        </div>

        <!-- Filtros para Clientes por Tipo -->
        <div v-if="pestañaActiva === 'por-tipo'" class="moda-filter-bar mb-4">
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="moda-label">Filtrar por Tipo:</label>
                    <select v-model="filtroTipo" @change="cargarClientesPorTipo" class="moda-select">
                        <option value="">Todos los tipos</option>
                        <option value="Natural">Natural</option>
                        <option value="Jurídico">Jurídico</option>
                        <option value="Genérico">Genérico</option>
                    </select>
                </div>
                <div class="col-md-6 d-flex align-items-end">
                    <button @click="cargarClientesPorTipo" class="btn moda-btn-primary">
                        <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
                    </button>
                </div>
            </div>
        </div>

        <!-- Estados de carga y error -->
        <div v-if="cargando" class="moda-loading-state">
            <div class="moda-spinner"></div>
            <p class="mt-3 moda-subtitle">Cargando reporte...</p>
        </div>

        <div v-else-if="errorConexion" class="moda-alert moda-alert-error">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Error de Conexión: No se pudo cargar el reporte. Verifique la conexión con el servidor.
        </div>

        <!-- Reporte: Top Clientes -->
        <div v-else-if="pestañaActiva === 'top'">
            <div class="moda-report-header mb-4">
                <div>
                    <h5 class="moda-report-title">
                        <i class="bi bi-trophy-fill me-2"></i>
                        Top 10 Clientes por Volumen de Compras
                    </h5>
                    <p class="moda-report-subtitle">
                        Período: {{ filtroFechaInicio || 'Inicio' }} al {{ filtroFechaFin || 'Fin' }}
                    </p>
                </div>
                <button @click="cargarTopClientes" class="btn moda-btn-outline-secondary">
                    <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
                </button>
            </div>

            <div v-if="topClientes.length === 0" class="moda-alert moda-alert-info">
                <i class="bi bi-info-circle me-2"></i>
                No hay datos de ventas para mostrar en el rango de fecha seleccionado.
            </div>

            <div v-else class="moda-table-container">
                <table class="moda-table">
                    <thead>
                        <tr>
                            <th class="moda-table-th text-center">#</th>
                            <th class="moda-table-th">Cliente</th>
                            <th class="moda-table-th text-center">Total Ventas</th>
                            <th class="moda-table-th text-end">Monto Total</th>
                            <th class="moda-table-th text-end">Base Imponible</th>
                            <th class="moda-table-th text-end">IVA</th>
                            <th class="moda-table-th">Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(cliente, index) in topClientes" :key="cliente.cedula_cliente"
                            :class="getRowClass(index)">
                            <td class="moda-table-td text-center">
                                <span class="moda-rank-badge" :class="getRankClass(index)">
                                    {{ index + 1 }}
                                </span>
                            </td>
                            <td class="moda-table-td">
                                <div class="moda-client-info">
                                    <div class="moda-client-name">{{ cliente.Cliente?.nombre || 'N/A' }}</div>
                                    <div class="moda-client-id">{{ cliente.cedula_cliente }}</div>
                                </div>
                            </td>
                            <td class="moda-table-td text-center">
                                <span class="moda-badge moda-badge-secondary">
                                    {{ obtenerValor(cliente, 'total_ventas') }}
                                </span>
                            </td>
                            <td class="moda-table-td text-end">
                                <span class="moda-amount moda-amount-total">
                                    {{ formatearMoneda(obtenerValor(cliente, 'monto_total')) }}
                                </span>
                            </td>
                            <td class="moda-table-td text-end">
                                <span class="moda-amount">
                                    {{ formatearMoneda(obtenerValor(cliente, 'base_imponible')) }}
                                </span>
                            </td>
                            <td class="moda-table-td text-end">
                                <span class="moda-amount moda-amount-tax">
                                    {{ formatearMoneda(obtenerValor(cliente, 'total_iva')) }}
                                </span>
                            </td>
                            <td class="moda-table-td">
                                <span class="moda-badge" :class="getTipoBadgeClass(cliente.Cliente?.tipo)">
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
            <div class="moda-report-header mb-4">
                <div>
                    <h5 class="moda-report-title">
                        <i class="bi bi-filter-square me-2"></i>
                        Clientes {{ filtroTipo ? `- Tipo: ${filtroTipo}` : '- Todos los Tipos' }}
                    </h5>
                    <p class="moda-report-subtitle">
                        Segmentación por tipo de cliente
                    </p>
                </div>
                <div class="moda-report-stats">
                    <span class="moda-stat-item">
                        <i class="bi bi-people-fill me-1"></i>
                        Total: {{ clientesPorTipo.length }}
                    </span>
                </div>
            </div>

            <div v-if="clientesPorTipo.length === 0" class="moda-alert moda-alert-info">
                <i class="bi bi-info-circle me-2"></i>
                No hay clientes que coincidan con el filtro seleccionado.
            </div>

            <div v-else class="moda-table-container">
                <table class="moda-table">
                    <thead>
                        <tr>
                            <th class="moda-table-th">Cédula</th>
                            <th class="moda-table-th">Nombre</th>
                            <th class="moda-table-th">Contacto</th>
                            <th class="moda-table-th">Tipo</th>
                            <th class="moda-table-th text-center">Total Compras</th>
                            <th class="moda-table-th text-end">Monto Total</th>
                            <th class="moda-table-th">F. Registro</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cliente in clientesPorTipo" :key="cliente.cedula">
                            <td class="moda-table-td">
                                <span class="moda-id-badge">{{ cliente.cedula }}</span>
                            </td>
                            <td class="moda-table-td">
                                <div class="moda-client-name">{{ cliente.nombre }}</div>
                            </td>
                            <td class="moda-table-td">
                                <div class="moda-contact-info">
                                    <div class="moda-contact-email">{{ cliente.email }}</div>
                                    <div class="moda-contact-phone">{{ cliente.telefono }}</div>
                                </div>
                            </td>
                            <td class="moda-table-td">
                                <span class="moda-badge" :class="getTipoBadgeClass(cliente.tipo)">
                                    {{ cliente.tipo }}
                                </span>
                            </td>
                            <td class="moda-table-td text-center">
                                <span class="moda-badge moda-badge-secondary">
                                    {{ obtenerValor(cliente, 'total_compras') }}
                                </span>
                            </td>
                            <td class="moda-table-td text-end">
                                <span class="moda-amount moda-amount-total">
                                    {{ formatearMoneda(obtenerValor(cliente, 'monto_total_compras')) }}
                                </span>
                            </td>
                            <td class="moda-table-td">
                                {{ formatearFecha(cliente.fecha_registro) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

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

// Función para establecer rango de fecha
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

// Funciones de estilo para filas
const getRowClass = (index) => {
    return index % 2 === 0 ? 'moda-row-even' : 'moda-row-odd';
};

const getRankClass = (index) => {
    if (index === 0) return 'moda-rank-1';
    if (index === 1) return 'moda-rank-2';
    if (index === 2) return 'moda-rank-3';
    return 'moda-rank-other';
};

const getTipoBadgeClass = (tipo) => {
    switch (tipo) {
        case 'Natural': return 'moda-badge-primary';
        case 'Jurídico': return 'moda-badge-success';
        case 'Genérico': return 'moda-badge-warning';
        default: return 'moda-badge-secondary';
    }
};

onMounted(() => {
    establecerRangoFecha(30);
});
</script>

<style scoped>
/* Contenedor principal */
.moda-main-container {
    background-color: #FFFDFB;
    border-radius: 14px;
    border: 1px solid #D6CFC8;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(74, 59, 52, 0.1);
    margin: 2rem auto;
}

/* Título */
.moda-title {
    color: #3A2E2A;
    font-weight: 700;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #D6CFC8;
}

.moda-icon-danger {
    color: #dc3545;
}

/* Tarjetas */
.moda-card {
    background-color: #F8F5F2;
    border-radius: 12px;
    border: 1px solid #D6CFC8;
    margin-bottom: 1.5rem;
}

.moda-card-body {
    padding: 1.5rem;
}

/* Filtros */
.moda-filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.moda-filter-group {
    display: flex;
    flex-direction: column;
}

.moda-label {
    color: #3A2E2A;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.moda-input,
.moda-select {
    background-color: white;
    border: 2px solid #D6CFC8;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    color: #3A2E2A;
    font-size: 1rem;
    transition: all 0.3s ease;
    width: 100%;
}

.moda-input:focus,
.moda-select:focus {
    border-color: #4A3B34;
    box-shadow: 0 0 0 3px rgba(74, 59, 52, 0.2);
    outline: none;
}

/* Botones */
.btn {
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid;
}

.moda-btn-outline-secondary {
    background-color: transparent;
    border-color: #8B7355;
    color: #8B7355;
}

.moda-btn-outline-secondary:hover {
    background-color: #8B7355;
    color: white;
    transform: translateY(-2px);
}

.moda-btn-outline-danger {
    background-color: transparent;
    border-color: #dc3545;
    color: #dc3545;
}

.moda-btn-outline-danger:hover {
    background-color: #dc3545;
    color: white;
    transform: translateY(-2px);
}

.moda-btn-primary {
    background-color: #4A3B34;
    border-color: #4A3B34;
    color: white;
}

.moda-btn-primary:hover {
    background-color: #352822;
    border-color: #352822;
    transform: translateY(-2px);
}

/* Grupo de botones */
.moda-btn-group {
    display: flex;
    gap: 0.25rem;
}

.moda-btn-group .btn {
    flex: 1;
}

/* Pestañas */
.moda-tabs-container {
    background-color: #F8F5F2;
    border-radius: 10px;
    padding: 0.5rem;
}

.moda-tabs {
    display: flex;
    gap: 0.5rem;
}

.moda-tab {
    flex: 1;
    background-color: transparent;
    border: 2px solid transparent;
    color: #8B7355;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.moda-tab:hover {
    background-color: rgba(139, 115, 85, 0.1);
    color: #5D4A3A;
}

.moda-tab.active {
    background-color: #FFFDFB;
    border-color: #4A3B34;
    color: #4A3B34;
    box-shadow: 0 2px 8px rgba(74, 59, 52, 0.15);
}

/* Descripción y subtítulos */
.moda-subtitle {
    color: #8B7355;
    font-weight: 500;
    font-size: 1rem;
    margin-bottom: 0;
}

.moda-report-description {
    background-color: #F8F5F2;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #4A3B34;
}

/* Cabecera de reporte */
.moda-report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #D6CFC8;
}

.moda-report-title {
    color: #3A2E2A;
    font-weight: 600;
    font-size: 1.3rem;
    margin-bottom: 0.25rem;
}

.moda-report-subtitle {
    color: #8B7355;
    font-size: 0.9rem;
    margin-bottom: 0;
}

.moda-report-stats {
    display: flex;
    gap: 1rem;
}

.moda-stat-item {
    background-color: rgba(139, 115, 85, 0.1);
    color: #8B7355;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
}

/* Barra de filtros */
.moda-filter-bar {
    background-color: #F8F5F2;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #D6CFC8;
}

/* Tabla */
.moda-table-container {
    background-color: white;
    border-radius: 10px;
    border: 1px solid #D6CFC8;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(74, 59, 52, 0.08);
}

.moda-table {
    width: 100%;
    border-collapse: collapse;
}

.moda-table-th {
    background: linear-gradient(135deg, #4A3B34, #5D4A3A);
    color: white;
    padding: 1rem;
    font-weight: 600;
    text-align: left;
    border: none;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.moda-table-td {
    padding: 1rem;
    color: #3A2E2A;
    border-bottom: 1px solid #D6CFC8;
    vertical-align: middle;
}

.moda-row-even {
    background-color: white;
}

.moda-row-odd {
    background-color: rgba(139, 115, 85, 0.03);
}

.moda-row-even:hover,
.moda-row-odd:hover {
    background-color: rgba(139, 115, 85, 0.05);
}

/* Badges */
.moda-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.moda-badge-secondary {
    background-color: rgba(139, 115, 85, 0.15);
    color: #8B7355;
}

.moda-badge-primary {
    background-color: rgba(74, 59, 52, 0.15);
    color: #4A3B34;
}

.moda-badge-success {
    background-color: rgba(25, 135, 84, 0.15);
    color: #198754;
}

.moda-badge-warning {
    background-color: rgba(255, 193, 7, 0.15);
    color: #ffc107;
}

/* Ranks especiales para top 3 */
.moda-rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-weight: 700;
    font-size: 0.9rem;
}

.moda-rank-1 {
    background-color: #FFD700;
    color: #3A2E2A;
}

.moda-rank-2 {
    background-color: #C0C0C0;
    color: #3A2E2A;
}

.moda-rank-3 {
    background-color: #CD7F32;
    color: #3A2E2A;
}

.moda-rank-other {
    background-color: #D6CFC8;
    color: #3A2E2A;
}

/* Información de cliente */
.moda-client-info {
    display: flex;
    flex-direction: column;
}

.moda-client-name {
    font-weight: 600;
    color: #3A2E2A;
    margin-bottom: 0.25rem;
}

.moda-client-id {
    color: #8B7355;
    font-size: 0.85rem;
}

.moda-id-badge {
    background-color: rgba(74, 59, 52, 0.1);
    color: #4A3B34;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9rem;
}

.moda-contact-info {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
}

.moda-contact-email {
    color: #3A2E2A;
    margin-bottom: 0.25rem;
}

.moda-contact-phone {
    color: #8B7355;
}

/* Montos */
.moda-amount {
    font-weight: 500;
    font-size: 1rem;
}

.moda-amount-total {
    color: #198754;
    font-weight: 600;
}

.moda-amount-tax {
    color: #dc3545;
}

/* Alertas y estados */
.moda-alert {
    padding: 1rem 1.5rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    border: 1px solid;
    display: flex;
    align-items: center;
}

.moda-alert-error {
    background-color: rgba(220, 53, 69, 0.1);
    border-color: #dc3545;
    color: #dc3545;
}

.moda-alert-info {
    background-color: rgba(139, 115, 85, 0.1);
    border-color: #8B7355;
    color: #8B7355;
}

.moda-loading-state {
    text-align: center;
    padding: 3rem;
}

.moda-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #D6CFC8;
    border-top-color: #4A3B34;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 1200px) {
    .moda-table-container {
        overflow-x: auto;
    }

    .moda-table {
        min-width: 1000px;
    }
}

@media (max-width: 768px) {
    .moda-main-container {
        padding: 1.5rem;
        margin: 1rem auto;
    }

    .moda-filter-grid {
        grid-template-columns: 1fr;
    }

    .moda-tabs {
        flex-direction: column;
    }

    .moda-report-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .moda-report-stats {
        width: 100%;
        justify-content: space-between;
    }
}

@media (max-width: 576px) {
    .moda-title {
        font-size: 1.5rem;
    }

    .moda-filter-bar .row {
        flex-direction: column;
        gap: 1rem;
    }

    .moda-filter-bar .col-md-6 {
        width: 100%;
    }

    .moda-btn-group {
        flex-direction: column;
    }
}
</style>