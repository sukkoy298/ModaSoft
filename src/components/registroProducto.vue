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

// --- Fetchers de Frontend ---

// Asumiendo que GET /api/categorias y /api/marcas ya están implementadas
const fetchDependencias = async () => {
    try {
        const [catResponse, marcaResponse] = await Promise.all([
            axios.get(`${API_URL}/categorias`),
            axios.get(`${API_URL}/marcas`)
        ]);

        categorias.value = catResponse.data;
        marcas.value = marcaResponse.data;

        // Establecer valores por defecto (opcional)
        if (categorias.value.length > 0) productoForm.value.id_categoria = categorias.value[0].id_categoria;
        if (marcas.value.length > 0) productoForm.value.id_marca = marcas.value[0].id_marca;

    } catch (error) {
        console.error('Error al cargar categorías/marcas:', error);
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = 'Fallo al cargar dependencias (Categorías/Marcas). Asegúrese que los endpoints estén activos.';
    } finally {
        loading.value = false;
    }
};

onMounted(fetchDependencias);

// --- Lógica de Registro ---
const registrarProductoPrincipal = async () => {
    // Validación simple
    if (!productoForm.value.nombre || !productoForm.value.id_categoria || !productoForm.value.id_marca) {
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = 'Complete los campos obligatorios (Nombre, Categoría, Marca).';
        return;
    }

    submitLoading.value = true;
    mensajeFeedback.value = '';
    
    try {
        // Usa la ruta POST /api/productos que configuramos
        const response = await axios.post(`${API_URL}/productos`, productoForm.value);
        
        tipoFeedback.value = 'success';
        mensajeFeedback.value = `Producto principal "${response.data.producto.nombre}" registrado con éxito! ID: ${response.data.id_producto}`;
        
        // Redirigir al registro de variantes para añadir stock inmediatamente
        setTimeout(() => {
            // Pasamos el ID del producto recién creado a la variante
            router.push({ path: '/registroVarianteProducto', query: { id_producto: response.data.id_producto } }); 
        }, 2000);

    } catch (error) {
        console.error('Error al registrar producto principal:', error);
        tipoFeedback.value = 'danger';
        mensajeFeedback.value = error.response?.data?.message || 'Error desconocido al registrar el producto principal.';
    } finally {
        submitLoading.value = false;
    }
};
</script>

<template>
    <div class="container mx-auto p-4 max-w-lg">
        <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center border-b pb-3">
            👚 Registro de Producto Principal (Nombre, Categoría, Marca)
        </h1>

        <div v-if="mensajeFeedback" :class="['alert mb-4', tipoFeedback === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
            {{ mensajeFeedback }}
        </div>

        <div v-if="loading" class="text-center p-4 text-lg text-gray-500">
            Cargando dependencias (Categorías y Marcas)...
        </div>

        <div v-else class="bg-light rounded border border-emphasis-tertiary shadow-xl p-6">
            <form @submit.prevent="registrarProductoPrincipal" class="m-1">
                
                <div class="form-floating mb-3">
                    <input type="text" v-model="productoForm.nombre" id="inputNombre" 
                        class="form-control border rounded" placeholder="Nombre del Producto (ej: Vestido de Noche)" required />
                    <label for="inputNombre" class="form-label">Nombre del Producto *</label>
                </div>

                <div class="form-floating mb-3">
                    <textarea v-model="productoForm.descripcion" id="inputDescripcion" 
                        class="form-control border rounded" placeholder="Descripción breve" style="height: 100px"></textarea>
                    <label for="inputDescripcion" class="form-label">Descripción</label>
                </div>

                <div class="form-floating mb-3">
                    <select v-model="productoForm.id_categoria" id="selectCategoria" 
                        class="form-select border rounded" required>
                        <option v-for="cat in categorias" :key="cat.id_categoria" :value="cat.id_categoria">
                            {{ cat.nombre }}
                        </option>
                    </select>
                    <label for="selectCategoria" class="form-label">Categoría *</label>
                </div>

                <div class="form-floating mb-4">
                    <select v-model="productoForm.id_marca" id="selectMarca" 
                        class="form-select border rounded" required>
                        <option v-for="marca in marcas" :key="marca.id_marca" :value="marca.id_marca">
                            {{ marca.nombre }}
                        </option>
                    </select>
                    <label for="selectMarca" class="form-label">Marca *</label>
                </div>

                <button type="submit" :disabled="submitLoading" 
                    class="btn btn-outline-success w-full px-4 py-2 rounded shadow"
                    style="width: 15%;">
                    <span v-if="submitLoading">Registrando Producto...</span>
                    <span v-else>Guardar Producto Principal</span>
                </button>
            </form>
        </div>
    </div>
</template>