<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000/api/categorias';

const router = useRouter();

// --- Estado del Componente ---
const categoriaForm = ref({
    nombre: '',
    descripcion: ''
});

const submitLoading = ref(false);
const mensajeFeedback = ref('');
const tipoFeedback = ref('');

// --- Lógica de Registro ---
const registrarCategoria = async () => {
    if (!categoriaForm.value.nombre) {
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = 'El nombre de la categoría es obligatorio.';
        return;
    }

    submitLoading.value = true;
    mensajeFeedback.value = '';
    
    try {
        const response = await axios.post(API_URL, categoriaForm.value);
        
        tipoFeedback.value = 'success';
        mensajeFeedback.value = `Categoría "${response.data.categoria.nombre}" registrada con éxito!`;
        
        // Limpiar formulario
        categoriaForm.value.nombre = '';
        categoriaForm.value.descripcion = '';

    } catch (error) {
        console.error('Error al registrar categoría:', error);
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = error.response?.data?.error || 'Error desconocido al registrar la categoría.';
    } finally {
        submitLoading.value = false;
    }
};
</script>

<template>
    <div class="container mx-auto p-4 max-w-md">
        <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center border-b pb-3">
            ➕ Registro de Nueva Categoría
        </h1>

        <div v-if="mensajeFeedback" :class="['alert mb-4', tipoFeedback === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
            {{ mensajeFeedback }}
        </div>

        <div class="bg-white rounded-xl shadow-xl p-6">
            <form @submit.prevent="registrarCategoria">
                
                <div class="form-floating mb-3">
                    <input type="text" v-model="categoriaForm.nombre" id="inputNombre" 
                        class="form-control border rounded" placeholder="Nombre de la Categoría" required />
                    <label for="inputNombre" class="form-label">Nombre de la Categoría *</label>
                </div>

                <div class="form-floating mb-4">
                    <textarea v-model="categoriaForm.descripcion" id="inputDescripcion" 
                        class="form-control border rounded" placeholder="Descripción breve" style="height: 100px"></textarea>
                    <label for="inputDescripcion" class="form-label">Descripción (Opcional)</label>
                </div>

                <button type="submit" :disabled="submitLoading" 
                    class="btn btn-outline-primary w-full px-4 py-2 rounded shadow">
                    <span v-if="submitLoading">Guardando...</span>
                    <span v-else>Registrar Categoría</span>
                </button>
            </form>
        </div>
    </div>
</template>