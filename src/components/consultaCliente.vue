<script setup>
import Header from '@/components/Header.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { clientes } from '@/cliente.js' // Ya no necesitamos setClienteAEditar ni eliminarCliente aquí

const router = useRouter()

// Variables reactivas
const terminoBusqueda = ref('');
const clienteEncontrado = ref(null); 
const busquedaEjecutada = ref(false);

const buscarCliente = () => {
    busquedaEjecutada.value = true;
    clienteEncontrado.value = null; 

    const idBuscado = Number(terminoBusqueda.value.trim()); 

    if (isNaN(idBuscado) || idBuscado === 0) {
        return; 
    }

    const resultado = clientes.value.find(cliente => cliente.id === idBuscado);

    if (resultado) {
        clienteEncontrado.value = resultado;
    } 
};

</script>

<template>
    <Header />
    <div class="m-5">
        <h2 class="text-center mb-4">Módulo de Facturación: Buscar Cliente</h2>

        <form class="d-flex mb-4" role="search" @submit.prevent="buscarCliente">
            <div class="form-floating flex-grow-1 me-2">
                <input type="text" class="form-control" required placeholder="Buscar ID del Cliente" v-model="terminoBusqueda"
                    id="floatingInput" aria-label="Search" />
                <label for="floatingInput">Buscar ID del Cliente</label>
            </div>
            <button class="btn btn-outline-success" type="submit">
                 <i class="bi bi-search"></i> Buscar
            </button>
        </form>

        <div class="d-flex justify-content-end mb-4">
            <router-link to="/registro" class="btn btn-primary">
                <i class="bi bi-person-plus-fill"></i> Registrar Nuevo Cliente
            </router-link>
        </div>

        <table v-if="clienteEncontrado" class="table table-bordered table-sm mt-4 w-50 mx-auto p-2 h3">
            <tbody>
                <tr v-for="(valor, clave) in clienteEncontrado" :key="clave">
                    <th scope="row" class="table-info" style="width: 30%;">{{ clave.charAt(0).toUpperCase() + clave.slice(1).replace('_', ' ') }}</th>
                    <td>{{ valor }}</td>
                </tr>
                
                <tr>
                    <th scope="row" class="table-secondary"></th>
                    <td class="text-center">
                        <router-link to="/facturacion" class="btn btn-success btn-lg">
                            <i class="bi bi-cash-coin"></i> Realizar Venta con {{ clienteEncontrado.nombre }}
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else-if="busquedaEjecutada" class="alert alert-warning mt-4 text-center">
            ❌ No se encontró ningún cliente con el ID **{{ terminoBusqueda }}**. ¿Desea registrarlo?
        </div>

        <div v-else class="alert alert-info mt-4 text-center">
            Introduzca un ID de cliente para iniciar una venta.
        </div>

    </div>
</template>