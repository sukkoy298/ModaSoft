<script setup>
import { ref, onMounted, computed } from 'vue';

// Importamos la función de fetching que acabamos de crear para el frontend
import { obtenerTodoElInventario } from '@/producto.js';

// Estado reactivo
const inventarioList = ref([]);
const loading = ref(true);
const errorConexion = ref(false);
const busqueda = ref('');

// Función para determinar el estado de inventario
const getEstadoStock = (stockActual, stockMinimo) => {
    // Usamos el stock mínimo real si existe, o un valor por defecto de 10 si no
    const min = stockMinimo || 10;

    if (stockActual <= 0) return 'Agotado';
    if (stockActual <= min) return 'REORDENAR';
    return 'Suficiente';
};

// Función para cargar los datos
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

// Propiedad computada para filtrar la lista según la búsqueda
const inventarioFiltrado = computed(() => {
    if (!busqueda.value) {
        return inventarioList.value;
    }
    const query = busqueda.value.toLowerCase();
    return inventarioList.value.filter(item => {
        // Filtra por SKU, Nombre del Producto, Talla o Color
        return (
            item.sku.toLowerCase().includes(query) ||
            item.producto.toLowerCase().includes(query) || // 'producto' es el alias del nombre
            item.talla.toLowerCase().includes(query) ||
            item.color.toLowerCase().includes(query)
        );
    });
});

// Cargar datos al montar el componente
onMounted(() => {
    cargarInventario();
});
</script>

<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center border-b pb-3">
            📦 Módulo de Inventario de Productos
        </h1>

        <!-- Campo de búsqueda y acciones -->
        <div class="mb-6 p-4 bg-white rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center">

            <div class="form-floating flex-grow me-4 mb-3 md:mb-0">
                <input type="text" v-model="busqueda" placeholder="Buscar por SKU, Producto, Talla o Color..."
                    id="floatingBuscador" class="form-control border rounded w-full" />
                <label for="floatingBuscador" class="form-label">Buscar Producto (SKU, Nombre, Variante...)</label>
            </div>

            <button @click="cargarInventario" :disabled="loading"
                class="btn btn-outline-success w-full md:w-auto px-6 py-2 rounded shadow">
                <span v-if="loading">Cargando...</span>
                <span v-else>Actualizar Inventario</span>
            </button>
        </div>

        <!-- Alerta de Error de Conexión -->
        <div v-if="errorConexion"
            class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-md" role="alert">
            <p class="font-bold">Error de Conexión</p>
            <p>No se pudo conectar con el servidor Express. Asegúrese de que el backend está corriendo en
                http://localhost:3000.</p>
        </div>

        <!-- Mensaje de Carga -->
        <div v-else-if="loading" class="text-center p-8 text-lg text-gray-500">
            Cargando datos del inventario...
        </div>

        <!-- Tabla de Inventario -->
        <div v-else-if="inventarioFiltrado.length > 0" class="bg-white rounded-xl shadow-xl overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">SKU
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Producto</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Variante</th>
                        <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Stock
                            Mín.</th>
                        <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Stock
                            Act.</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Precio
                            Venta</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Estado
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="variante in inventarioFiltrado" :key="variante.sku" :class="[
                        'hover:bg-gray-50 transition duration-100 ease-in-out',
                        { 'bg-red-100/50': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Agotado' },
                        { 'bg-yellow-100/50': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'REORDENAR' }
                    ]">

                        <!-- SKU -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {{ variante.sku }}
                        </td>

                        <!-- Producto -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                            {{ variante.producto }}
                        </td>

                        <!-- Variante (Talla/Color) -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span class="font-medium text-gray-800">{{ variante.talla }}</span> /
                            <span :style="{ backgroundColor: variante.color.toLowerCase() }"
                                class="inline-block w-3 h-3 rounded-full border border-gray-400"></span>
                            {{ variante.color }}
                        </td>

                        <!-- Stock Mínimo -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {{ variante.stock_minimo }}
                        </td>

                        <!-- Stock Actual -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-center" :class="{
                            'text-red-600': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Agotado',
                            'text-yellow-600': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'REORDENAR',
                            'text-green-600': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Suficiente'
                        }">
                            {{ variante.stock_actual }}
                        </td>

                        <!-- Precio Venta -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                            ${{ variante.precio_venta.toFixed(2) }}
                        </td>

                        <!-- Estado -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span :class="[
                                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                { 'bg-red-200 text-red-800': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Agotado' },
                                { 'bg-yellow-200 text-yellow-800': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'REORDENAR' },
                                { 'bg-green-200 text-green-800': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Suficiente' }
                            ]">
                                {{ getEstadoStock(variante.stock_actual, variante.stock_minimo) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mensaje de Sin Resultados -->
        <div v-else class="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
            <p>No se encontraron productos en el inventario o la búsqueda no arrojó resultados.</p>
        </div>
    </div>
</template>

<style scoped>
/* Estilos para asegurar que la tabla sea legible */
.container {
    max-width: 1200px;
}
</style>
