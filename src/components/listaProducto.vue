<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerTodoElInventario } from '@/producto.js';

const router = useRouter();

const goToRegistroVariante = () => {
    router.push('/registroVarianteProducto');
};

const inventarioList = ref([]);
const loading = ref(true);
const errorConexion = ref(false);
const busqueda = ref('');

const getEstadoStock = (stockActual, stockMinimo) => {
    const min = stockMinimo || 10;

    if (stockActual <= 0) return 'Agotado';
    if (stockActual <= min) return 'REORDENAR';
    return 'Suficiente';
};

const cargarInventario = async () => {
    loading.value = true;
    errorConexion.value = false;
    try {
        const data = await obtenerTodoElInventario();
        inventarioList.value = data;
    } catch (error) {
        console.error('Fallo grave al cargar inventario:', error);
        errorConexion.value = true;
    } finally {
        loading.value = false;
    }
};

const inventarioFiltrado = computed(() => {
    if (!busqueda.value) {
        return inventarioList.value;
    }
    const query = busqueda.value.toLowerCase();
    return inventarioList.value.filter(item => {
        return (
            item.sku.toLowerCase().includes(query) ||
            item.producto.toLowerCase().includes(query) ||
            item.talla.toLowerCase().includes(query) ||
            item.color.toLowerCase().includes(query)
        );
    });
});

onMounted(() => {
    cargarInventario();
});
</script>

<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center border-b pb-3">
            📦 Módulo de Inventario de Productos
        </h1>

        <div class="mb-6 p-4 bg-white rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center">

            <div class="form-floating flex-grow me-4 mb-3 md:mb-0">
                <input type="text" v-model="busqueda" placeholder="Buscar por SKU, Producto, Talla o Color..."
                    id="floatingBuscador" class="form-control border rounded w-full" />
                <label for="floatingBuscador" class="form-label">Buscar Producto (SKU, Nombre, Variante...)</label>
            </div>

            <button @click="router.push('/registroProducto')"
                class="btn btn-outline-success w-full md:w-auto px-6 py-2 rounded shadow me-3 md:mb-0">
                + Producto Principal
            </button>
            <button @click="router.push('/registroCategoria')"
                class="btn btn-outline-dark w-full md:w-auto px-4 py-2 rounded shadow me-2 md:mb-0">
                + Categoría
            </button>

            <button @click="router.push('/registroMarca')"
                class="btn btn-outline-info w-full text-dark md:w-auto px-4 py-2 rounded shadow me-2 md:mb-0">
                + Marca
            </button>
            <button @click="goToRegistroVariante"
                class="btn btn-outline-primary w-full md:w-auto px-6 py-2 rounded shadow me-3 md:mb-0">
                + Registrar Nueva Variante
            </button>
            <button @click="cargarInventario" :disabled="loading"
                class="btn btn-outline-danger w-full md:w-auto px-6 py-2 rounded shadow">
                <span v-if="loading">Cargando...</span>
                <span v-else>Actualizar Inventario</span>
            </button>
        </div>

        <div v-if="errorConexion"
            class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-md" role="alert">
            <p class="font-bold">Error de Conexión</p>
            <p>No se pudo conectar con el servidor Express. Asegúrese de que el backend está corriendo en
                http://localhost:3000.</p>
        </div>

        <div v-else-if="loading" class="text-center p-8 text-lg text-gray-500">
            Cargando datos del inventario...
        </div>

        <div v-else-if="inventarioFiltrado.length > 0" class="bg-white rounded-xl shadow-xl overflow-x-auto">
            
            <table class="table table-striped table-hover align-middle min-w-full">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">SKU</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Marca / Categoría</th>
                        <th scope="col" class="text-center">Talla / Color</th>
                        <th scope="col" class="text-center">Stock Mín.</th>
                        <th scope="col" class="text-center">Stock Act.</th>
                        <th scope="col">Precio Venta</th>
                        <th scope="col" class="text-center">Estado</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="variante in inventarioFiltrado" :key="variante.sku" :class="{
                        'table-danger': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Agotado',
                        'table-warning': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'REORDENAR'
                    }">
                        
                        <td class="font-semibold">{{ variante.sku }}</td>
                        
                        <td class="text-gray-700">{{ variante.producto }}</td>
                        
                        <td class="text-sm text-gray-500">{{ variante.marca }} / {{ variante.categoria }}</td>

                        <td class="text-center">
                            <span class="font-medium text-gray-800">{{ variante.talla }}</span> / 
                            {{ variante.color }}
                        </td>

                        <td class="text-center">{{ variante.stock_minimo }}</td>

                        <td class="font-bold text-center" :class="{
                            'text-danger': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Agotado',
                            'text-warning': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'REORDENAR',
                            'text-success': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Suficiente'
                        }">
                            {{ variante.stock_actual }}
                        </td>

                        <td>
                            ${{ variante.precio_venta.toFixed(2) }}
                        </td>

                        <td class="text-center">
                            <span :class="[
                                'badge',
                                { 'bg-danger': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Agotado' },
                                { 'bg-warning text-dark': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'REORDENAR' },
                                { 'bg-success': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Suficiente' }
                            ]">
                                {{ getEstadoStock(variante.stock_actual, variante.stock_minimo) }}
                            </span>
                        </td>
                        
                        <td class="text-center">
                            <button class="btn btn-sm btn-outline-info me-2">
                                <i class="bi bi-pencil-square"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-arrow-up"></i> Ingreso
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
            <p>No se encontraron productos en el inventario o la búsqueda no arrojó resultados.</p>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1300px;
}
</style>