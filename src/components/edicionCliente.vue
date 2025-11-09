<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue' 
import { obtenerClientePorCedula, editarCliente } from '@/cliente.js' 

const router = useRouter();
const route = useRoute();

const cedula = route.params.cedula;
const mensaje = ref('');
const esError = ref(false);
const cliente = ref({
    cedula: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    tipo: 'Natural'
});

const cargarCliente = async () => {
    try {
        const data = await obtenerClientePorCedula(cedula);
        cliente.value = data; 
        
    } catch (error) {
        console.error(`❌ Error al cargar cliente ${cedula}:`, error);
        mensaje.value = `❌ No se pudieron cargar los datos del cliente ${cedula}.`;
        esError.value = true;
        
        setTimeout(() => {
            router.push('/listaCliente'); 
        }, 2000); 
    }
};

onMounted(() => {
    cargarCliente();
});

const manejarEdicion = async () => {
    mensaje.value = '';
    esError.value = false;

    try {
        // Enviar todos los datos del cliente excepto campos internos
        const { fecha_registro, activo, ...datosActualizados } = cliente.value;
        
        await editarCliente(cedula, datosActualizados); 
        mensaje.value = '✅ Cliente actualizado con éxito.';
        esError.value = false;
        
        setTimeout(() => {
            router.push('/listaCliente');
        }, 1500);

    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error al actualizar. Revise los datos.';
        mensaje.value = `❌ Fallo: ${errorMsg}`;
        esError.value = true;
    }
};

const navegarALista = () => {
    router.push('/listaCliente');
};
</script>

<template>
    <Header />
    <div class="container mt-5">
        <h1 class="text-center mb-4">Editar Cliente: {{ cliente.nombre || cedula }}</h1>
        <hr>

        <div v-if="mensaje" :class="['alert', esError ? 'alert-danger' : 'alert-success']" role="alert">
            {{ mensaje }}
        </div>

        <form v-if="cliente.cedula" @submit.prevent="manejarEdicion" class="p-4 border rounded shadow-sm">
            
            <div class="mb-3">
                <label for="cedula" class="form-label">Cédula</label>
                <input type="text" class="form-control" id="cedula" v-model="cliente.cedula" disabled>
                <div class="form-text">La cédula no se puede modificar</div>
            </div>
            
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre *</label>
                <input type="text" class="form-control" id="nombre" v-model="cliente.nombre" required>
            </div>

            <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono *</label>
                <input type="tel" class="form-control" id="telefono" v-model="cliente.telefono" required>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email *</label>
                <input type="email" class="form-control" id="email" v-model="cliente.email" required>
            </div>
            
            <div class="mb-3">
                <label for="direccion" class="form-label">Dirección *</label>
                <textarea class="form-control" id="direccion" v-model="cliente.direccion" rows="3" required></textarea>
            </div>

            <div class="mb-3">
                <label for="tipo" class="form-label">Tipo de Cliente *</label>
                <select class="form-select" id="tipo" v-model="cliente.tipo" required>
                    <option value="Natural">Natural</option>
                    <option value="Jurídico">Jurídico</option>
                    <option value="Genérico">Genérico</option> 
                </select>
            </div>
            
            <div class="d-flex justify-content-between pt-3">
                <button type="button" @click="navegarALista" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Volver a la Lista
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-save"></i> Guardar Cambios
                </button>
            </div>
        </form>
        
        <div v-else-if="!esError" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando datos del cliente {{ cedula }}...</p>
        </div>
    </div>
</template>