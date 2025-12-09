<template>
    <div class="container mt-5 mb-5 moda-container">
        <h1 class="moda-title text-center mb-4">🏷️ Registro de Nueva Marca</h1>

        <div v-if="mensajeFeedback" :class="[
            'alert alert-moda mb-4',
            tipoFeedback === 'success' ? 'border-success' : 'border-danger'
        ]" role="alert">
            {{ mensajeFeedback }}
        </div>

        <div class="moda-card p-4 shadow-lg">
            <form @submit.prevent="registrarMarca">
                <div class="mb-4">
                    <label for="inputNombre" class="form-label moda-subtitle fw-bold mb-2">Nombre de la Marca *</label>
                    <input type="text" v-model="marcaForm.nombre" id="inputNombre" 
                        class="form-control moda-input" placeholder="Ej: Puma, Nike, Zara, Adidas..." required />
                    <div class="form-text">Ingresa el nombre de la marca comercial</div>
                </div>

                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="submit" :disabled="submitLoading" 
                        class="btn btn-moda-primary px-4 py-2">
                        <span v-if="submitLoading">
                            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                            Guardando...
                        </span>
                        <span v-else>
                            <i class="bi bi-tag-fill me-2"></i>Registrar Marca
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

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
const tipoFeedback = ref('');

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
        const response = await axios.post(API_URL, marcaForm.value);
        
        tipoFeedback.value = 'success';
        mensajeFeedback.value = `✅ Marca "${response.data.marca.nombre}" registrada con éxito!`;
        
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

<style scoped>
.container {
    max-width: 500px;
}

.moda-card {
    padding: 2rem !important;
}

.alert-moda {
    padding: 1rem;
    border-radius: 10px;
}

.alert-moda.border-success {
    border-left: 4px solid #198754 !important;
    background-color: rgba(25, 135, 84, 0.1);
}

.alert-moda.border-danger {
    border-left: 4px solid #dc3545 !important;
    background-color: rgba(220, 53, 69, 0.1);
}
</style>