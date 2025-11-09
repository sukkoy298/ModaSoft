<script setup>
import Header from '@/components/Header.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
    obtenerTodosLosClientes, 
    obtenerClientesInactivos,
    eliminarCliente, 
    restaurarCliente 
} from '@/cliente.js' 

const router = useRouter();
const listaClientes = ref([]); 
const listaClientesInactivos = ref([]);
const errorConexion = ref(false); 
const cargando = ref(true);
const pestañaActiva = ref('activos'); // 'activos' o 'inactivos'

const cargarClientes = async () => {
    errorConexion.value = false;
    cargando.value = true;
    try {
        if (pestañaActiva.value === 'activos') {
            const data = await obtenerTodosLosClientes();
            listaClientes.value = data;
        } else {
            const data = await obtenerClientesInactivos();
            listaClientesInactivos.value = data;
        }
    } catch (error) {
        console.error('Fallo grave al cargar clientes:', error);
        errorConexion.value = true;
    } finally {
        cargando.value = false;
    }
};

const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    try {
        const fechaObj = new Date(fecha);
        // Agregar 4 horas para compensar la diferencia UTC
        fechaObj.setHours(fechaObj.getHours() + 4);
        
        return fechaObj.toLocaleDateString('es-VE');
    } catch (error) {
        console.error('Error formateando fecha:', fecha, error);
        return 'Fecha inválida';
    }
};

const cambiarPestaña = (pestaña) => {
    pestañaActiva.value = pestaña;
    cargarClientes();
};

onMounted(() => {
    cargarClientes();
});

const navegarAEdicion = (cedula) => {
    router.push({ name: 'edicion-cliente', params: { cedula: cedula } });
};

const manejarEliminacion = async (cedula, nombre) => { 
    if (!window.confirm(`¿Está seguro de eliminar al cliente ${nombre} (${cedula})?`)) {
        return;
    }

    try {
        const resultado = await eliminarCliente(cedula);
        
        if (resultado.tipo === "hard_delete") {
            alert(`✅ Cliente ${nombre} eliminado físicamente de la base de datos.`);
        } else {
            alert(`✅ Cliente ${nombre} marcado como inactivo.`);
        }

        cargarClientes();
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error al eliminar el cliente.';
        alert(`❌ Fallo: ${errorMsg}`); 
    }
};

const manejarRestauracion = async (cedula, nombre) => { 
    if (!window.confirm(`¿Está seguro de restaurar al cliente ${nombre} (${cedula})?`)) {
        return;
    }

    try {
        await restaurarCliente(cedula);
        alert(`✅ Cliente ${nombre} restaurado correctamente.`);
        cargarClientes();
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error al restaurar el cliente.';
        alert(`❌ Fallo: ${errorMsg}`); 
    }
};

const navegarARegistro = () => {
    router.push('/registro');
}
</script>

<template>
    <Header />
    <div class="container mt-5">
        <h1 class="text-center mb-4">Administración de Clientes</h1>
        
        <!-- Pestañas -->
        <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
                <button 
                    class="nav-link" 
                    :class="{ 'active': pestañaActiva === 'activos' }"
                    @click="cambiarPestaña('activos')"
                >
                    <i class="bi bi-person-check"></i> Clientes Activos
                    <span class="badge bg-success ms-1">{{ pestañaActiva === 'activos' ? listaClientes.length : '' }}</span>
                </button>
            </li>
            <li class="nav-item">
                <button 
                    class="nav-link" 
                    :class="{ 'active': pestañaActiva === 'inactivos' }"
                    @click="cambiarPestaña('inactivos')"
                >
                    <i class="bi bi-person-x"></i> Clientes Inactivos
                    <span class="badge bg-secondary ms-1">{{ pestañaActiva === 'inactivos' ? listaClientesInactivos.length : '' }}</span>
                </button>
            </li>
        </ul>

        <div class="d-flex justify-content-between mb-4">
            <h5 class="text-muted">
                {{ pestañaActiva === 'activos' ? 'Total de Clientes Activos' : 'Total de Clientes Inactivos' }}: 
                {{ pestañaActiva === 'activos' ? listaClientes.length : listaClientesInactivos.length }}
            </h5>
            <button @click="navegarARegistro" class="btn btn-success">
                <i class="bi bi-person-plus-fill"></i> Registrar Nuevo Cliente
            </button>
        </div>

        <div v-if="cargando" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando lista de clientes...</p>
        </div>

        <div v-else-if="errorConexion" class="alert alert-danger text-center">
            ⚠️ Error de Conexión: El servidor Express (Puerto 3000) no respondió o fue inaccesible.
        </div>

        <!-- Tabla de Clientes Activos -->
        <div v-else-if="pestañaActiva === 'activos'">
            <div v-if="listaClientes.length === 0" class="alert alert-info text-center">
                No hay clientes activos registrados en la base de datos.
            </div>

            <div v-else class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Cédula</th> 
                            <th scope="col">Nombre</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Email</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">F. Registro</th>
                            <th scope="col" class="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cliente in listaClientes" :key="cliente.id_cliente"> 
                            <td>{{ cliente.cedula || 'N/A' }}</td> 
                            <td>{{ cliente.nombre || 'N/A' }}</td>
                            <td>{{ cliente.telefono || 'N/A' }}</td>
                            <td>{{ cliente.email || 'N/A' }}</td>
                            <td>{{ cliente.tipo || 'N/A' }}</td>
                            <td>{{ formatearFecha(cliente.fecha_registro) }}</td> 
                            <td class="text-center">
                                <button 
                                    @click="navegarAEdicion(cliente.cedula)" 
                                    class="btn btn-sm btn-outline-primary me-2"
                                    title="Editar cliente"
                                >
                                    <i class="bi bi-pencil-square"></i> Editar
                                </button>
                                <button 
                                    @click="manejarEliminacion(cliente.cedula, cliente.nombre)" 
                                    class="btn btn-sm btn-outline-danger"
                                    title="Eliminar cliente"
                                >
                                    <i class="bi bi-trash-fill"></i> Eliminar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tabla de Clientes Inactivos -->
        <div v-else-if="pestañaActiva === 'inactivos'">
            <div v-if="listaClientesInactivos.length === 0" class="alert alert-info text-center">
                No hay clientes inactivos en la base de datos.
            </div>

            <div v-else class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Cédula</th> 
                            <th scope="col">Nombre</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Email</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">F. Registro</th>
                            <th scope="col" class="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cliente in listaClientesInactivos" :key="cliente.id_cliente"> 
                            <td>{{ cliente.cedula || 'N/A' }}</td> 
                            <td>{{ cliente.nombre || 'N/A' }}</td>
                            <td>{{ cliente.telefono || 'N/A' }}</td>
                            <td>{{ cliente.email || 'N/A' }}</td>
                            <td>{{ cliente.tipo || 'N/A' }}</td>
                            <td>{{ formatearFecha(cliente.fecha_registro) }}</td> 
                            <td class="text-center">
                                <button 
                                    @click="manejarRestauracion(cliente.cedula, cliente.nombre)" 
                                    class="btn btn-sm btn-outline-success me-2"
                                    title="Restaurar cliente"
                                >
                                    <i class="bi bi-arrow-clockwise"></i> Restaurar
                                </button>
                                <span class="text-muted small">Inactivo</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>