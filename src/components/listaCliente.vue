

<script setup>
import Header from '@/components/Header.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { verificarServidor, obtenerTodosLosClientes, eliminarCliente } from '@/cliente.js' 

const router = useRouter();
const listaClientes = ref([]); 
const errorConexion = ref(false);
const cargando = ref(true);

const cargarClientes = async () => {
    errorConexion.value = false;
    cargando.value = true;
    
    try {
        console.log('🔍 Verificando conexión con el servidor...');
        
        // Primero verifica si el servidor está activo
        await verificarServidor();
        console.log('✅ Servidor conectado, cargando clientes...');
        
        // Luego carga los clientes
        const data = await obtenerTodosLosClientes();
        listaClientes.value = data;
        console.log('✅ Clientes cargados exitosamente');
        
    } catch (error) {
        console.error('❌ Fallo al conectar con el servidor:', error);
        errorConexion.value = true;
    } finally {
        cargando.value = false;
    }
};

onMounted(() => {
    cargarClientes();
});


// 3. FUNCIÓN QUE GESTIONA LA ELIMINACIÓN Y CONFIRMACIÓN
const manejarEliminacion = async (cedula, nombre) => { 
    
    if (!window.confirm(`¿Está seguro de eliminar al cliente ${nombre} (${cedula})?`)) {
        return;
    }

    try {
        console.log(`Intentando eliminar cliente: ${nombre} (${cedula})...`);
        await eliminarCliente(cedula);
        console.log(`✅ Cliente ${nombre} eliminado correctamente.`);
        
        // Notificamos al usuario del éxito (usando alert)
        alert(`✅ Cliente ${nombre} eliminado correctamente.`);

        cargarClientes(); // Recarga la lista después de eliminar
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error al eliminar. Verifique si el cliente tiene ventas asociadas.';
        console.error(`❌ Fallo al eliminar: ${errorMsg}`);
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
        <div class="d-flex justify-content-between mb-4">
            <h5 class="text-muted">Total de Clientes: {{ listaClientes.length }}</h5>
            <button @click="navegarARegistro" class="btn btn-success">
                <i class="bi bi-person-plus-fill"></i> Registrar Nuevo Cliente
            </button>
        </div>

        <div v-if="errorConexion" class="alert alert-danger text-center">
            ⚠️ Error de Conexión: El servidor Express (Puerto 3000) no respondió o fue inaccesible.
        </div>

        <div v-else-if="listaClientes.length === 0" class="alert alert-info text-center">
            Aún no hay clientes registrados en la base de datos.
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
                    <tr v-for="cliente in listaClientes" :key="cliente.cedula"> 
                        <td>{{ cliente.cedula }}</td> 
                        <td>{{ cliente.nombre }}</td>
                        <td>{{ cliente.telefono }}</td>
                        <td>{{ cliente.email }}</td>
                        <td>{{ cliente.tipo }}</td>
                        <!-- Aseguramos que la fecha se muestre formateada para mejor lectura -->
                        <td>{{ new Date(cliente.fecha_registro).toLocaleDateString() }}</td> 
                        <td class="text-center">
                            <button 
                                @click="navegarAEdicion(cliente.cedula)" 
                                class="btn btn-sm btn-outline-primary me-2"
                            >
                                <i class="bi bi-pencil-square"></i> Editar
                            </button>
                            <!--  Llama a la función simplificada de eliminación -->
                            <button @click="manejarEliminacion(cliente.cedula, cliente.nombre)" class="btn btn-sm btn-outline-danger">
                                <i class="bi bi-trash-fill"></i> Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>