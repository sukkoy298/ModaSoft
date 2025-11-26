<script setup>
import Header from '@/components/Header.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerClientePorCedula, limpiarClienteAEditar } from '@/cliente.js' 

const router = useRouter()

const terminoBusqueda = ref('');
const clienteEncontrado = ref(null); 
const busquedaEjecutada = ref(false);
const mensajeError = ref('');

const irARegistrar = () => {
    limpiarClienteAEditar();
    router.push('/registro');
};

const buscarCliente = async () => {
    busquedaEjecutada.value = true;
    clienteEncontrado.value = null;
    mensajeError.value = '';

    const cedulaBuscada = terminoBusqueda.value.trim(); 

    if (!cedulaBuscada) {
        return; 
    }

    try {
        const resultado = await obtenerClientePorCedula(cedulaBuscada);
        clienteEncontrado.value = resultado;
    } catch (error) {
        console.error('Error al buscar cliente:', error);
        
        if (error.message.includes('no encontrado') || error.message.includes('inactivo')) {
            mensajeError.value = `No se encontró ningún cliente activo con la cédula "${cedulaBuscada}"`;
        } else {
            mensajeError.value = 'Error al buscar cliente. Verifique la conexión con el servidor.';
        }
    }
};

</script>

<template>
    <Header />
    <div class="m-5 w-50 mx-auto p-2 bg-light border border-tertiary-emphasis rounded">
        <h2 class="text-center mb-4">Módulo de Facturación: Buscar Cliente</h2>

        <form class="d-flex mb-4" role="search" @submit.prevent="buscarCliente">
            <div class="form-floating flex-grow-1 me-2 mx-auto p-2">
                <input type="text" class="h5 form-control mx-auto p-2" required placeholder="Buscar Cédula del Cliente" v-model="terminoBusqueda"
                    id="floatingInput" aria-label="Search" />
                <label class="h5" for="floatingInput">Buscar por Cédula/RUC</label>
            </div>
            <button class="btn btn-outline-success" type="submit">
                   <i class="bi bi-search"></i> Buscar
            </button>
        </form>

        <div class="d-flex justify-content-end mb-4">
            <button @click="irARegistrar" class="btn btn-outline-primary">
                <i class="bi bi-person-plus-fill"></i> Registrar Nuevo Cliente
            </button>
        </div>

        <!-- Mostrar cliente encontrado -->
        <div v-if="clienteEncontrado" class="mt-4">
            <h4 class="text-success mb-3">✅ Cliente Encontrado</h4>
            <table class="table table-bordered table-sm mx-auto p-2 h3">
                <tbody>
                    <tr>
                        <th class="table-info" style="width: 30%;">Cédula</th>
                        <td>{{ clienteEncontrado.cedula }}</td>
                    </tr>
                    <tr>
                        <th class="table-info">Nombre</th>
                        <td>{{ clienteEncontrado.nombre }}</td>
                    </tr>
                    <tr>
                        <th class="table-info">Teléfono</th>
                        <td>{{ clienteEncontrado.telefono }}</td>
                    </tr>
                    <tr>
                        <th class="table-info">Email</th>
                        <td>{{ clienteEncontrado.email }}</td>
                    </tr>
                    <tr>
                        <th class="table-info">Dirección</th>
                        <td>{{ clienteEncontrado.direccion }}</td>
                    </tr>
                    <tr>
                        <th class="table-info">Tipo</th>
                        <td>{{ clienteEncontrado.tipo }}</td>
                    </tr>
                    <tr>
                        <th class="table-secondary"></th>
                        <td class="text-center">
                            <router-link to="/facturacion" class="btn btn-success btn-lg w-50">
                                <i class="bi bi-cash-coin"></i> Realizar Venta con {{ clienteEncontrado.nombre }}
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mostrar mensajes de error -->
        <div v-else-if="mensajeError" class="alert alert-warning mt-4 text-center">
            ❌ {{ mensajeError }}
            <div class="mt-2">
                <button @click="irARegistrar" class="btn btn-primary btn-sm">
                    <i class="bi bi-person-plus-fill"></i> Registrar este cliente
                </button>
            </div>
        </div>

        <div v-else-if="busquedaEjecutada" class="alert alert-info mt-4 text-center">
            Introduzca una Cédula/RUC de cliente para iniciar una venta.
        </div>

    </div>
</template>