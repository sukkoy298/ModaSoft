<template>
    <div class="container mt-5 mb-5 moda-container">
        <h1 class="moda-title text-center mb-4">👚 Registro de Producto Principal</h1>

        <div v-if="mensajeFeedback" :class="[
            'alert alert-moda mb-4',
            tipoFeedback === 'success' ? 'border-success' : 'border-danger'
        ]" role="alert">
            {{ mensajeFeedback }}
        </div>

        <div v-if="loading" class="text-center p-4">
            <div class="spinner-border text-moda-secondary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 moda-subtitle">Cargando categorías y marcas...</p>
        </div>

        <div v-else class="moda-card p-4 shadow-lg">
            <form @submit.prevent="registrarProductoPrincipal">
                
                <div class="row g-3 mb-4">
                    <div class="col-md-12">
                        <label for="inputNombre" class="form-label moda-subtitle fw-bold mb-2">Nombre del Producto *</label>
                        <input type="text" v-model="productoForm.nombre" id="inputNombre" 
                            class="form-control moda-input" placeholder="Ej: Vestido de Noche, Camisa Clásica..." required />
                    </div>

                    <div class="col-md-12">
                        <label for="inputDescripcion" class="form-label moda-subtitle fw-bold mb-2">Descripción</label>
                        <textarea v-model="productoForm.descripcion" id="inputDescripcion" 
                            class="form-control moda-input" placeholder="Descripción detallada del producto..." 
                            style="height: 120px"></textarea>
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label for="selectCategoria" class="form-label moda-subtitle fw-bold mb-2">Categoría *</label>
                        <select v-model="productoForm.id_categoria" id="selectCategoria" 
                            class="form-select moda-input" required>
                            <option value="" disabled>Selecciona una categoría</option>
                            <option v-for="cat in categorias" :key="cat.id_categoria" :value="cat.id_categoria">
                                {{ cat.nombre }}
                            </option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label for="selectMarca" class="form-label moda-subtitle fw-bold mb-2">Marca *</label>
                        <select v-model="productoForm.id_marca" id="selectMarca" 
                            class="form-select moda-input" required>
                            <option value="" disabled>Selecciona una marca</option>
                            <option v-for="marca in marcas" :key="marca.id_marca" :value="marca.id_marca">
                                {{ marca.nombre }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="submit" :disabled="submitLoading" 
                        class="btn btn-moda-primary px-4 py-2">
                        <span v-if="submitLoading">
                            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                            Registrando...
                        </span>
                        <span v-else>
                            <i class="bi bi-box-seam me-2"></i>Guardar Producto Principal
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000/api'; 
const router = useRouter();

// --- Estado del Componente ---
const productoForm = ref({
    nombre: '',
    descripcion: '',
    id_categoria: '',
    id_marca: '',
    activo: 1 
});

const categorias = ref([]);
const marcas = ref([]);
const loading = ref(true);
const submitLoading = ref(false);
const mensajeFeedback = ref('');
const tipoFeedback = ref(''); 

// Fetchers de Frontend
const fetchDependencias = async () => {
    try {
        const [catResponse, marcaResponse] = await Promise.all([
            axios.get(`${API_URL}/categorias`),
            axios.get(`${API_URL}/marcas`)
        ]);

        categorias.value = catResponse.data;
        marcas.value = marcaResponse.data;

    } catch (error) {
        console.error('Error al cargar categorías/marcas:', error);
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = 'Fallo al cargar dependencias. Verifique la conexión.';
    } finally {
        loading.value = false;
    }
};

onMounted(fetchDependencias);

// --- Lógica de Registro ---
const registrarProductoPrincipal = async () => {
    if (!productoForm.value.nombre || !productoForm.value.id_categoria || !productoForm.value.id_marca) {
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = 'Complete los campos obligatorios (Nombre, Categoría, Marca).';
        return;
    }

    submitLoading.value = true;
    mensajeFeedback.value = '';
    
    try {
        const response = await axios.post(`${API_URL}/productos`, productoForm.value);
        
        tipoFeedback.value = 'success';
        mensajeFeedback.value = `✅ Producto "${response.data.producto.nombre}" registrado con éxito! Redirigiendo a variantes...`;
        
        setTimeout(() => {
            router.push({ 
                path: '/registroVarianteProducto', 
                query: { id_producto: response.data.id_producto } 
            }); 
        }, 2000);

    } catch (error) {
        console.error('Error al registrar producto principal:', error);
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = error.response?.data?.message || 'Error al registrar el producto principal.';
    } finally {
        submitLoading.value = false;
    }
};
</script>

<style scoped>
.container {
    max-width: 800px;
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

.spinner-border.text-moda-secondary {
    color: var(--moda-secondary) !important;
}
</style>