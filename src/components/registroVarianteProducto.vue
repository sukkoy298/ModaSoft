<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000/api'; 
const router = useRouter();

// --- Estado del Componente ---
const varianteForm = ref({
    id_producto: '', // FK: ID del producto principal
    sku: '',         // Único: Identificador de la variante
    talla: '',
    color: '',
    stock_actual: 0,
    precio_venta: 0.00
});

const productos = ref([]); // Lista de productos principales ya registrados
const loading = ref(true);
const submitLoading = ref(false);
const mensajeFeedback = ref('');
const tipoFeedback = ref('');


// Función para obtener la lista de Productos Principales
const fetchProductos = async () => {
    try {
        const response = await axios.get(`${API_URL}/productos/`);
        productos.value = response.data.map(p => ({
            id: p.id_producto,
            nombre: `${p.nombre} (${p.Marca ? p.Marca.nombre : 'Sin Marca'})`
        }));

        if (productos.value.length > 0) {
            varianteForm.value.id_producto = productos.value[0].id;
        }
    } catch (error) {
        console.error('Error al obtener productos principales:', error);
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = 'Fallo al cargar la lista de productos. Verifique la ruta /api/productos.';
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
        mensajeFeedback.value = 'Asegúrese de seleccionar un Producto, ingresar el SKU y el Precio de Venta.';
        return;
    }

    submitLoading.value = true;
    mensajeFeedback.value = '';
    
    try {
        const response = await axios.post(`${API_URL}/productos/variantes`, varianteForm.value);
        
        // Manejo de éxito
        tipoFeedback.value = 'success';
        mensajeFeedback.value = `Variante SKU: ${response.data.sku} registrada con éxito!`;
        
        // Redireccionar o limpiar formulario
        setTimeout(() => {
            router.push('/listaProducto'); // Redirige a la vista de inventario
        }, 2000);

    } catch (error) {
        console.error('Error al registrar variante:', error);
        tipoFeedback.value = 'danger';
        // Mostrar mensaje de error del backend si existe
        mensajeFeedback.value = error.response?.data?.message || 'Error desconocido al registrar la variante.';
    } finally {
        submitLoading.value = false;
    }
};
</script>

<template>
    <div class="container mx-auto p-4 max-w-lg">
        <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center border-b pb-3">
            🏷️ Registro de Variante de Producto (SKU, Talla, Color)
        </h1>

        <div v-if="mensajeFeedback" :class="[
            'alert mb-4',
            tipoFeedback === 'success' ? 'alert-success' : 'alert-danger'
        ]" role="alert">
            {{ mensajeFeedback }}
        </div>

        <div v-if="loading" class="text-center p-4 text-lg text-gray-500">
            Cargando lista de productos...
        </div>

        <div v-else class="bg-white rounded-xl shadow-xl p-6">
            <form @submit.prevent="registrarVariante">
                
                <div class="form-floating mb-3">
                    <select v-model="varianteForm.id_producto" id="selectProducto" 
                        class="form-select border rounded" required>
                        <option v-for="prod in productos" :key="prod.id" :value="prod.id">
                            {{ prod.nombre }}
                        </option>
                    </select>
                    <label for="selectProducto" class="form-label">Producto Principal *</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" v-model="varianteForm.sku" id="inputSKU" 
                        class="form-control border rounded" placeholder="SKU Único (ej: VS-R-S-1004)" required />
                    <label for="inputSKU" class="form-label">SKU (Código de Variante) *</label>
                </div>

                <div class="flex space-x-3 mb-3">
                    <div class="form-floating flex-1">
                        <input type="text" v-model="varianteForm.talla" id="inputTalla" 
                            class="form-control border rounded" placeholder="Talla (S, M, L, 36, etc.)" required />
                        <label for="inputTalla" class="form-label">Talla *</label>
                    </div>
                    <div class="form-floating flex-1">
                        <input type="text" v-model="varianteForm.color" id="inputColor" 
                            class="form-control border rounded" placeholder="Color" required />
                        <label for="inputColor" class="form-label">Color *</label>
                    </div>
                </div>

                <div class="flex space-x-3 mb-4">
                    <div class="form-floating flex-1">
                        <input type="number" v-model.number="varianteForm.stock_actual" id="inputStock" 
                            class="form-control border rounded" placeholder="Stock Inicial" min="0" required />
                        <label for="inputStock" class="form-label">Stock Inicial *</label>
                    </div>
                    <div class="form-floating flex-1">
                        <input type="number" v-model.number="varianteForm.precio_venta" id="inputPrecio" 
                            class="form-control border rounded" placeholder="Precio de Venta" min="0.01" step="0.01" required />
                        <label for="inputPrecio" class="form-label">Precio de Venta *</label>
                    </div>
                </div>

                <button type="submit" :disabled="submitLoading" 
                    class="btn btn-primary w-full px-4 py-2 rounded shadow">
                    <span v-if="submitLoading">Registrando Variante...</span>
                    <span v-else>Guardar Variante</span>
                </button>
            </form>
        </div>
    </div>
</template>
