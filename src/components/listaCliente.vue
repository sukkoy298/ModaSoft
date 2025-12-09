<template>
    <Header />
    <div class="container moda-main-container mt-5 mb-5">
        <h1 class="moda-title text-center mb-4">Administración de Clientes</h1>
        
        <!-- Pestañas estilo Moda -->
        <div class="moda-tabs-container mb-4">
            <div class="moda-tabs">
                <button 
                    class="moda-tab"
                    :class="{ 'active': pestañaActiva === 'activos' }"
                    @click="cambiarPestaña('activos')"
                >
                    <i class="bi bi-person-check me-2"></i> Clientes Activos
                    <span class="moda-badge bg-success">{{ pestañaActiva === 'activos' ? listaClientes.length : '' }}</span>
                </button>
                <button 
                    class="moda-tab"
                    :class="{ 'active': pestañaActiva === 'inactivos' }"
                    @click="cambiarPestaña('inactivos')"
                >
                    <i class="bi bi-person-x me-2"></i> Clientes Inactivos
                    <span class="moda-badge bg-secondary">{{ pestañaActiva === 'inactivos' ? listaClientesInactivos.length : '' }}</span>
                </button>
            </div>
        </div>

        <!-- Encabezado con contador y botón -->
        <div class="moda-header-card mb-4">
            <div class="d-flex justify-content-between align-items-center p-3">
                <div>
                    <h5 class="moda-subtitle mb-0">
                        {{ pestañaActiva === 'activos' ? 'Total de Clientes Activos' : 'Total de Clientes Inactivos' }}: 
                        <span class="moda-counter">{{ pestañaActiva === 'activos' ? listaClientes.length : listaClientesInactivos.length }}</span>
                    </h5>
                </div>
                <button @click="navegarARegistro" class="btn btn-moda-primary">
                    <i class="bi bi-person-plus-fill me-2"></i> Registrar Nuevo Cliente
                </button>
            </div>
        </div>

        <!-- Estado de carga -->
        <div v-if="cargando" class="moda-loading-state">
            <div class="moda-spinner"></div>
            <p class="mt-3 moda-subtitle">Cargando lista de clientes...</p>
        </div>

        <!-- Error de conexión -->
        <div v-else-if="errorConexion" class="moda-alert moda-alert-error">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Error de Conexión: El servidor Express (Puerto 3000) no respondió o fue inaccesible.
        </div>

        <!-- Tabla de Clientes Activos -->
        <div v-else-if="pestañaActiva === 'activos'">
            <div v-if="listaClientes.length === 0" class="moda-alert moda-alert-info text-center">
                <i class="bi bi-info-circle me-2"></i>
                No hay clientes activos registrados en la base de datos.
            </div>

            <div v-else class="moda-table-container">
                <table class="moda-table">
                    <thead>
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
                            <td><strong>{{ cliente.cedula || 'N/A' }}</strong></td> 
                            <td>{{ cliente.nombre || 'N/A' }}</td>
                            <td>{{ cliente.telefono || 'N/A' }}</td>
                            <td><span class="moda-email">{{ cliente.email || 'N/A' }}</span></td>
                            <td>
                                <span class="moda-badge tipo-badge" :class="cliente.tipo?.toLowerCase()">
                                    {{ cliente.tipo || 'N/A' }}
                                </span>
                            </td>
                            <td>{{ formatearFecha(cliente.fecha_registro) }}</td> 
                            <td class="moda-actions">
                                <button 
                                    @click="navegarAEdicion(cliente.cedula)" 
                                    class="btn btn-moda-action btn-edit"
                                    title="Editar cliente"
                                >
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button 
                                    @click="manejarEliminacion(cliente.cedula, cliente.nombre)" 
                                    class="btn btn-moda-action btn-delete"
                                    title="Eliminar cliente"
                                >
                                    <i class="bi bi-trash-fill"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tabla de Clientes Inactivos -->
        <div v-else-if="pestañaActiva === 'inactivos'">
            <div v-if="listaClientesInactivos.length === 0" class="moda-alert moda-alert-info text-center">
                <i class="bi bi-info-circle me-2"></i>
                No hay clientes inactivos en la base de datos.
            </div>

            <div v-else class="moda-table-container">
                <table class="moda-table">
                    <thead>
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
                            <td><strong>{{ cliente.cedula || 'N/A' }}</strong></td> 
                            <td>{{ cliente.nombre || 'N/A' }}</td>
                            <td>{{ cliente.telefono || 'N/A' }}</td>
                            <td><span class="moda-email">{{ cliente.email || 'N/A' }}</span></td>
                            <td>
                                <span class="moda-badge tipo-badge" :class="cliente.tipo?.toLowerCase()">
                                    {{ cliente.tipo || 'N/A' }}
                                </span>
                            </td>
                            <td>{{ formatearFecha(cliente.fecha_registro) }}</td> 
                            <td class="moda-actions">
                                <button 
                                    @click="manejarRestauracion(cliente.cedula, cliente.nombre)" 
                                    class="btn btn-moda-action btn-restore"
                                    title="Restaurar cliente"
                                >
                                    <i class="bi bi-arrow-clockwise"></i>
                                </button>
                                <span class="moda-status-inactive">Inactivo</span>
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
import '../assets/css/global.css'
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
const pestañaActiva = ref('activos');

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

<style scoped>
/* Contenedor principal */
.moda-main-container {
    background-color: #FFFDFB;
    border-radius: 14px;
    border: 1px solid #D6CFC8;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(74, 59, 52, 0.1);
}

/* Títulos */
.moda-title {
    color: #3A2E2A;
    font-weight: 700;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #D6CFC8;
}

.moda-subtitle {
    color: #8B7355;
    font-weight: 500;
    font-size: 1rem;
}

.moda-counter {
    color: #4A3B34;
    font-weight: 700;
    font-size: 1.2rem;
}

/* Pestañas estilo Moda */
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

.moda-badge {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
}

/* Encabezado */
.moda-header-card {
    background-color: #F8F5F2;
    border-radius: 10px;
    border: 1px solid #D6CFC8;
}

/* Botones */
.btn-moda-primary {
    background-color: #4A3B34 !important;
    border-color: #4A3B34 !important;
    color: white !important;
    border-radius: 8px;
    padding: 0.5rem 1.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-moda-primary:hover {
    background-color: #352822 !important;
    border-color: #352822 !important;
    transform: translateY(-2px);
}

/* Estados */
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
    to { transform: rotate(360deg); }
}

/* Alertas */
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

/* Tabla */
.moda-table-container {
    background-color: #FFFDFB;
    border-radius: 10px;
    border: 1px solid #D6CFC8;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(74, 59, 52, 0.08);
}

.moda-table {
    width: 100%;
    border-collapse: collapse;
}

.moda-table thead {
    background: linear-gradient(135deg, #4A3B34, #5D4A3A);
}

.moda-table thead th {
    color: white;
    padding: 1rem;
    font-weight: 600;
    text-align: left;
    border: none;
}

.moda-table tbody tr {
    border-bottom: 1px solid #D6CFC8;
    transition: all 0.2s ease;
}

.moda-table tbody tr:hover {
    background-color: rgba(139, 115, 85, 0.05);
}

.moda-table tbody td {
    padding: 1rem;
    color: #3A2E2A;
    vertical-align: middle;
}

/* Badges de tipo */
.tipo-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.tipo-badge.generico {
    background-color: rgba(139, 115, 85, 0.15);
    color: #8B7355;
}

.tipo-badge.natural {
    background-color: rgba(74, 59, 52, 0.15);
    color: #4A3B34;
}

/* Email */
.moda-email {
    color: #4A3B34;
    font-size: 0.9rem;
}

/* Acciones */
.moda-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
}

.btn-moda-action {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    transition: all 0.2s ease;
}

.btn-edit {
    background-color: rgba(74, 59, 52, 0.1);
    color: #4A3B34;
}

.btn-edit:hover {
    background-color: #4A3B34;
    color: white;
    transform: translateY(-2px);
}

.btn-delete {
    background-color: rgba(220, 53, 69, 0.1);
    color: #dc3545;
}

.btn-delete:hover {
    background-color: #dc3545;
    color: white;
    transform: translateY(-2px);
}

.btn-restore {
    background-color: rgba(25, 135, 84, 0.1);
    color: #198754;
}

.btn-restore:hover {
    background-color: #198754;
    color: white;
    transform: translateY(-2px);
}

.moda-status-inactive {
    color: #6c757d;
    font-size: 0.85rem;
    font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
    .moda-main-container {
        padding: 1rem;
    }
    
    .moda-table-container {
        overflow-x: auto;
    }
    
    .moda-table {
        min-width: 800px;
    }
    
    .moda-tabs {
        flex-direction: column;
    }
    
    .moda-header-card .d-flex {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch !important;
    }
    
    .moda-header-card .btn {
        width: 100%;
    }
}

@media (max-width: 576px) {
    .moda-title {
        font-size: 1.5rem;
    }
    
    .moda-table thead th,
    .moda-table tbody td {
        padding: 0.75rem 0.5rem;
    }
    
    .moda-actions {
        flex-direction: column;
        gap: 0.25rem;
    }
}
</style>