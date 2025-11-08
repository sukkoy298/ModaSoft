<script setup>
import Header from '@/components/Header.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerClientePorCedula, limpiarClienteAEditar } from '@/cliente.js' 

const router = useRouter()

const terminoBusqueda = ref('');
const clienteEncontrado = ref(null); 
const busquedaEjecutada = ref(false);

const irARegistrar = () => {
    limpiarClienteAEditar();
    router.push('/registro');
};

const buscarCliente = async () => {
    busquedaEjecutada.value = true;
    clienteEncontrado.value = null; 

    const cedulaBuscada = terminoBusqueda.value.trim(); 

    if (!cedulaBuscada) {
        return; 
    }

    try {
        const resultado = await obtenerClientePorCedula(cedulaBuscada);
        clienteEncontrado.value = resultado;
    } catch (error) {
        // Manejamos error 404 (cliente no encontrado) o error de conexión
        if (error.response && error.response.status === 404) {
            clienteEncontrado.value = null; // Cliente no encontrado
        } else {
             console.error('Error al buscar cliente:', error);
             alert('Error al buscar cliente. Verifique la conexión con el servidor.');
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

        <table v-if="clienteEncontrado" class="table table-bordered table-sm mt-4 mx-auto p-2 h3">
            <tbody>
                <tr v-for="(valor, clave) in clienteEncontrado" :key="clave">
                    <th scope="row" class="table-info" style="width: 30%;">{{ clave.charAt(0).toUpperCase() + clave.slice(1).replace('_', ' ') }}</th>
                    <td>{{ valor }}</td>
                </tr>
                
                <tr>
                    <th scope="row" class="table-secondary"></th>
                    <td class="text-center">
                        <router-link to="/facturacion" class="btn btn-success btn-lg w-50">
                            <i class="bi bi-cash-coin"></i> Realizar Venta con {{ clienteEncontrado.nombre }}
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else-if="busquedaEjecutada" class="alert alert-warning mt-4 text-center">
            ❌ No se encontró ningún cliente con la Cédula/RUC **{{ terminoBusqueda }}**. ¿Desea registrarlo?
        </div>

        <div v-else class="alert alert-info mt-4 text-center h4">
            Introduzca una Cédula/RUC de cliente para iniciar una venta.
        </div>

    </div>
</template>