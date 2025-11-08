<script setup>
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/marcas'; 

// --- Estado del Componente ---
const marcaForm = ref({
    nombre: ''
});

const submitLoading = ref(false);
const mensajeFeedback = ref('');
const tipoFeedback = ref(''); // success o danger

// --- Lógica de Registro ---
const registrarMarca = async () => {
    if (!marcaForm.value.nombre) {
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = 'El nombre de la marca es obligatorio.';
        return;
    }

    submitLoading.value = true;
    mensajeFeedback.value = '';
    
    try {
        // Usa la ruta POST /api/marcas que configuramos
        const response = await axios.post(API_URL, marcaForm.value);
        
        tipoFeedback.value = 'success';
        mensajeFeedback.value = `Marca "${response.data.marca.nombre}" registrada con éxito!`;
        
        // Limpiar formulario
        marcaForm.value.nombre = '';

    } catch (error) {
        console.error('Error al registrar marca:', error);
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = error.response?.data?.error || 'Error desconocido al registrar la marca.';
    } finally {
        submitLoading.value = false;
    }
};
</script>

<template>
    <div class="container mx-auto p-4 max-w-md">
        <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center border-b pb-3">
            ➕ Registro de Nueva Marca
        </h1>

        <div v-if="mensajeFeedback" :class="['alert mb-4', tipoFeedback === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
            {{ mensajeFeedback }}
        </div>

        <div class="bg-white rounded-xl shadow-xl p-6">
            <form @submit.prevent="registrarMarca">
                
                <div class="form-floating mb-4">
                    <input type="text" v-model="marcaForm.nombre" id="inputNombre" 
                        class="form-control border rounded" placeholder="Nombre de la Marca" required />
                    <label for="inputNombre" class="form-label">Nombre de la Marca *</label>
                </div>

                <button type="submit" :disabled="submitLoading" 
                    class="btn btn-outline-primary w-full px-4 py-2 rounded shadow">
                    <span v-if="submitLoading">Guardando...</span>
                    <span v-else>Registrar Marca</span>
                </button>
            </form>
        </div>
    </div>
</template>