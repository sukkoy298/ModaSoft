<template>
    <div class="container mt-5 mb-5 moda-container">
        <h1 class="moda-title text-center mb-4">🏷️ Registro de Variante de Producto</h1>

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
            <p class="mt-3 moda-subtitle">Cargando lista de productos...</p>
        </div>

        <div v-else class="moda-card p-4 shadow-lg">
            <form @submit.prevent="registrarVariante">
                
                <div class="mb-4">
                    <label for="selectProducto" class="form-label moda-subtitle fw-bold mb-2">Producto Principal *</label>
                    <select v-model="varianteForm.id_producto" id="selectProducto" 
                        class="form-select moda-input" required>
                        <option value="" disabled>Selecciona un producto</option>
                        <option v-for="prod in productos" :key="prod.id" :value="prod.id">
                            {{ prod.nombre }}
                        </option>
                    </select>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label for="inputSKU" class="form-label moda-subtitle fw-bold mb-2">SKU (Código de Variante) *</label>
                        <input type="text" v-model="varianteForm.sku" id="inputSKU" 
                            class="form-control moda-input" placeholder="Ej: V5-R-S-1004" required />
                        <div class="form-text">Código único para identificar la variante</div>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="inputPrecio" class="form-label moda-subtitle fw-bold mb-2">Precio de Venta *</label>
                        <div class="input-group">
                            <span class="input-group-text moda-input border-end-0">$</span>
                            <input type="number" v-model.number="varianteForm.precio_venta" id="inputPrecio" 
                                class="form-control moda-input border-start-0" placeholder="0.00" 
                                min="0.01" step="0.01" required />
                        </div>
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label for="inputTalla" class="form-label moda-subtitle fw-bold mb-2">Talla *</label>
                        <input type="text" v-model="varianteForm.talla" id="inputTalla" 
                            class="form-control moda-input" placeholder="S, M, L, 36, etc." required />
                    </div>
                    
                    <div class="col-md-6">
                        <label for="inputColor" class="form-label moda-subtitle fw-bold mb-2">Color *</label>
                        <input type="text" v-model="varianteForm.color" id="inputColor" 
                            class="form-control moda-input" placeholder="Rojo, Azul, Negro, etc." required />
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label for="inputStock" class="form-label moda-subtitle fw-bold mb-2">Stock Inicial *</label>
                        <input type="number" v-model.number="varianteForm.stock_actual" id="inputStock" 
                            class="form-control moda-input" placeholder="0" min="0" required />
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
                            <i class="bi bi-save-fill me-2"></i>Guardar Variante
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
const varianteForm = ref({
    id_producto: '',
    sku: '',
    talla: '',
    color: '',
    stock_actual: 0,
    precio_venta: 0.00
});

const productos = ref([]);
const loading = ref(true);
const submitLoading = ref(false);
const mensajeFeedback = ref('');
const tipoFeedback = ref('');

// Función para obtener productos principales
const fetchProductos = async () => {
    try {
        const response = await axios.get(`${API_URL}/productos/`);
        productos.value = response.data.map(p => ({
            id: p.id_producto,
            nombre: `${p.nombre} (${p.Marca ? p.Marca.nombre : 'Sin Marca'})`
        }));

    } catch (error) {
        console.error('Error al obtener productos principales:', error);
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = 'Fallo al cargar la lista de productos.';
    }
};

onMounted(async () => {
    await fetchProductos();
    loading.value = false;
});

// --- Lógica de Registro ---
const registrarVariante = async () => {
    if (!varianteForm.value.id_producto || !varianteForm.value.sku || varianteForm.value.precio_venta <= 0) {
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = 'Complete los campos obligatorios (Producto, SKU, Precio).';
        return;
    }

    submitLoading.value = true;
    mensajeFeedback.value = '';
    
    try {
        const response = await axios.post(`${API_URL}/productos/variantes`, varianteForm.value);
        
        tipoFeedback.value = 'success';
        mensajeFeedback.value = `✅ Variante SKU: ${response.data.sku} registrada con éxito!`;
        
        setTimeout(() => {
            router.push('/listaProducto');
        }, 2000);

    } catch (error) {
        console.error('Error al registrar variante:', error);
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = error.response?.data?.message || 'Error al registrar la variante.';
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

.input-group-text {
    background-color: var(--moda-background) !important;
    border-color: var(--moda-light) !important;
    color: var(--moda-text-dark) !important;
}

.spinner-border.text-moda-secondary {
    color: var(--moda-secondary) !important;
}
</style>