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

// Esta función transforma los datos de la API al formato que necesita tu tabla
const transformarDatosInventario = (productos) => {
    const variantesLista = [];
    
    productos.forEach(producto => {
        // Verificar si el producto tiene variantes
        if (producto.variantes && Array.isArray(producto.variantes)) {
            producto.variantes.forEach(variante => {
                variantesLista.push({
                    sku: variante.sku || `SKU-${producto.id_producto}-${variante.id_variante}`,
                    producto: producto.nombre || 'Sin nombre',
                    marca: producto.marca || 'Sin marca',
                    categoria: producto.categoria || 'Sin categoría',
                    talla: variante.talla || 'N/A',
                    color: variante.color || 'N/A',
                    stock_minimo: 10, // Valor por defecto, puedes ajustarlo
                    stock_actual: variante.stock_actual || 0,
                    precio_venta: variante.precio || 0,
                    id_producto: producto.id_producto,
                    id_variante: variante.id_variante,
                    descripcion: producto.descripcion || ''
                });
            });
        } else {
            // Si el producto no tiene variantes, mostrar el producto principal
            variantesLista.push({
                sku: `PROD-${producto.id_producto}`,
                producto: producto.nombre || 'Sin nombre',
                marca: producto.marca || 'Sin marca',
                categoria: producto.categoria || 'Sin categoría',
                talla: 'Única',
                color: 'Único',
                stock_minimo: 10,
                stock_actual: 0,
                precio_venta: 0,
                id_producto: producto.id_producto,
                id_variante: null,
                descripcion: producto.descripcion || ''
            });
        }
    });
    
    return variantesLista;
};

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
        console.log('Datos recibidos de API:', data); // Para debugging
        
        if (Array.isArray(data)) {
            // Transformar los datos al formato que necesita la tabla
            inventarioList.value = transformarDatosInventario(data);
            console.log('Datos transformados:', inventarioList.value); // Para debugging
        } else {
            console.error('La API no devolvió un array:', data);
            inventarioList.value = [];
        }
    } catch (error) {
        console.error('Fallo grave al cargar inventario:', error);
        errorConexion.value = true;
        // Datos de ejemplo para desarrollo
        inventarioList.value = [
            {
                sku: 'EJEMPLO-001',
                producto: 'Camiseta Ejemplo',
                marca: 'Marca Demo',
                categoria: 'Ropa',
                talla: 'M',
                color: 'Blanco',
                stock_minimo: 10,
                stock_actual: 25,
                precio_venta: 29.99
            }
        ];
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
            (item.sku && item.sku.toLowerCase().includes(query)) ||
            (item.producto && item.producto.toLowerCase().includes(query)) ||
            (item.talla && item.talla.toLowerCase().includes(query)) ||
            (item.color && item.color.toLowerCase().includes(query)) ||
            (item.marca && item.marca.toLowerCase().includes(query)) ||
            (item.categoria && item.categoria.toLowerCase().includes(query))
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
                <input 
                    type="text" 
                    v-model="busqueda" 
                    placeholder="Buscar por SKU, Producto, Talla o Color..."
                    id="floatingBuscador" 
                    class="form-control border rounded w-full" 
                />
                <label for="floatingBuscador" class="form-label">Buscar Producto (SKU, Nombre, Variante...)</label>
            </div>

            <div class="flex flex-wrap gap-2 justify-center w-full md:w-auto">
                <button @click="router.push('/registroProducto')"
                    class="btn btn-outline-success px-4 py-2 rounded shadow text-sm md:text-base">
                    + Producto Principal
                </button>
                <button @click="router.push('/registroCategoria')"
                    class="btn btn-outline-dark px-3 py-2 rounded shadow text-sm md:text-base">
                    + Categoría
                </button>
                <button @click="router.push('/registroMarca')"
                    class="btn btn-outline-info text-dark px-3 py-2 rounded shadow text-sm md:text-base">
                    + Marca
                </button>
                <button @click="goToRegistroVariante"
                    class="btn btn-outline-primary px-4 py-2 rounded shadow text-sm md:text-base">
                    + Nueva Variante
                </button>
                <button @click="cargarInventario" :disabled="loading"
                    class="btn btn-outline-danger px-4 py-2 rounded shadow text-sm md:text-base">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Cargando...' : 'Actualizar' }}
                </button>
            </div>
        </div>

        <div v-if="errorConexion"
            class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-md" role="alert">
            <p class="font-bold">Error de Conexión</p>
            <p>No se pudo conectar con el servidor. Usando datos de demostración.</p>
        </div>

        <div v-else-if="loading" class="text-center p-8 text-lg text-gray-500">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando datos del inventario...</p>
        </div>

        <div v-else-if="inventarioFiltrado.length > 0" class="bg-white rounded-xl shadow-xl overflow-x-auto">
            <div class="p-3 bg-light">
                <p class="mb-0 text-muted">
                    Mostrando {{ inventarioFiltrado.length }} de {{ inventarioList.length }} productos
                    <span v-if="busqueda" class="text-primary"> (filtrados por: "{{ busqueda }}")</span>
                </p>
            </div>
            
            <table class="table table-striped table-hover align-middle min-w-full">
                <thead class="table-dark">
                    <tr>
                        <th scope="col" class="text-center">#</th>
                        <th scope="col">SKU</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Marca / Categoría</th>
                        <th scope="col" class="text-center">Talla / Color</th>
                        <th scope="col" class="text-center">Stock Mín.</th>
                        <th scope="col" class="text-center">Stock Act.</th>
                        <th scope="col" class="text-center">Precio Venta</th>
                        <th scope="col" class="text-center">Estado</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(variante, index) in inventarioFiltrado" :key="variante.sku + '-' + index" 
                        :class="{
                            'table-danger': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Agotado',
                            'table-warning': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'REORDENAR',
                            'table-success': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Suficiente'
                        }">
                        
                        <td class="text-center text-muted">{{ index + 1 }}</td>
                        
                        <td class="font-semibold">
                            <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">
                                {{ variante.sku }}
                            </span>
                        </td>
                        
                        <td class="text-gray-700">
                            <div class="fw-bold">{{ variante.producto }}</div>
                            <small class="text-muted" v-if="variante.descripcion">{{ variante.descripcion.substring(0, 50) }}...</small>
                        </td>
                        
                        <td class="text-sm">
                            <span class="badge bg-info bg-opacity-10 text-info me-1">{{ variante.marca }}</span>
                            <span class="badge bg-dark bg-opacity-10 text-dark">{{ variante.categoria }}</span>
                        </td>

                        <td class="text-center">
                            <span class="badge bg-primary me-1">{{ variante.talla }}</span>
                            <span class="badge" :style="{ 
                                backgroundColor: variante.color.toLowerCase(), 
                                color: ['blanco', 'amarillo', 'beige'].includes(variante.color.toLowerCase()) ? 'black' : 'white',
                                border: '1px solid #dee2e6'
                            }">
                                {{ variante.color }}
                            </span>
                        </td>

                        <td class="text-center">
                            <span class="badge bg-secondary">{{ variante.stock_minimo }}</span>
                        </td>

                        <td class="text-center">
                            <span class="fw-bold" :class="{
                                'text-danger': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Agotado',
                                'text-warning': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'REORDENAR',
                                'text-success': getEstadoStock(variante.stock_actual, variante.stock_minimo) === 'Suficiente'
                            }">
                                {{ variante.stock_actual }}
                            </span>
                        </td>

                        <td class="text-center">
                            <span class="badge bg-success text-white">
                                ${{ variante.precio_venta.toFixed(2) }}
                            </span>
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
                            <div class="btn-group btn-group-sm" role="group">
                                <button class="btn btn-outline-info" title="Editar">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-outline-primary" title="Ingreso de stock">
                                    <i class="bi bi-arrow-up"></i>
                                </button>
                                <button class="btn btn-outline-warning" title="Ver detalles">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div class="p-3 bg-light border-top">
                <div class="row">
                    <div class="col-md-6">
                        <small class="text-muted">
                            <span class="badge bg-danger">Agotado</span>
                            <span class="badge bg-warning text-dark ms-2">REORDENAR</span>
                            <span class="badge bg-success ms-2">Suficiente</span>
                        </small>
                    </div>
                    <div class="col-md-6 text-end">
                        <small class="text-muted">
                            Última actualización: {{ new Date().toLocaleTimeString() }}
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
            <div class="mb-4">
                <i class="bi bi-inbox display-1 text-muted"></i>
            </div>
            <h4 class="mb-3">Inventario vacío</h4>
            <p class="mb-4">No se encontraron productos en el inventario.</p>
            <button @click="router.push('/registroProducto')" class="btn btn-primary">
                <i class="bi bi-plus-circle me-2"></i>Agregar Primer Producto
            </button>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1400px;
}

.table th {
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.table td {
    vertical-align: middle;
}

.badge {
    font-size: 0.75rem;
    font-weight: 500;
}

.btn-group-sm > .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}

/* Efectos hover para las filas */
.table-hover tbody tr:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

/* Scroll personalizado para la tabla */
.overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #6c757d #f8f9fa;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background-color: #6c757d;
    border-radius: 4px;
}
</style>