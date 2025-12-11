<template>
    <Header/>
    <div class="container moda-main-container">
        <h1 class="moda-title text-center mb-4">
            <i class="bi bi-box-seam moda-icon-primary me-2"></i>
            Módulo de Inventario de Productos
        </h1>

        <!-- Barra de búsqueda y acciones -->
        <div class="moda-action-bar mb-4">
            <div class="moda-search-container">
                <div class="moda-search-group">
                    <i class="bi bi-search moda-search-icon"></i>
                    <input 
                        type="text" 
                        v-model="busqueda" 
                        placeholder="Buscar por SKU, Producto, Talla o Color..."
                        class="moda-search-input"
                    />
                </div>
            </div>

            <div class="moda-action-buttons">
                <button @click="router.push('/registroProducto')" class="btn moda-btn-outline-success">
                    <i class="bi bi-plus-circle me-1"></i> Producto Principal
                </button>
                <button @click="router.push('/registroCategoria')" class="btn moda-btn-outline">
                    <i class="bi bi-tag me-1"></i> Categoría
                </button>
                <button @click="router.push('/registroMarca')" class="btn moda-btn-outline">
                    <i class="bi bi-shop me-1"></i> Marca
                </button>
                <button @click="goToRegistroVariante" class="btn moda-btn-outline-primary">
                    <i class="bi bi-plus-square me-1"></i> Nueva Variante
                </button>
                <button @click="cargarInventario" :disabled="loading" class="btn moda-btn-outline-secondary">
                    <i class="bi bi-arrow-clockwise me-1"></i> {{ loading ? 'Cargando...' : 'Actualizar' }}
                </button>
            </div>
        </div>

        <!-- Mensajes de estado -->
        <div v-if="errorConexion" class="moda-alert moda-alert-error">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Error de Conexión: No se pudo conectar con el servidor. Usando datos de demostración.
        </div>

        <div v-else-if="loading" class="moda-loading-state">
            <div class="moda-spinner"></div>
            <p class="mt-3 moda-subtitle">Cargando datos del inventario...</p>
        </div>

        <!-- Tabla de inventario -->
        <div v-else-if="inventarioFiltrado.length > 0">
            <!-- Contador de resultados -->
            <div class="moda-table-header mb-3">
                <p class="moda-table-count">
                    Mostrando {{ inventarioFiltrado.length }} de {{ inventarioList.length }} productos
                    <span v-if="busqueda" class="moda-filter-note"> (filtrados por: "{{ busqueda }}")</span>
                </p>
            </div>
            
            <!-- Tabla -->
            <div class="moda-table-container">
                <table class="moda-table">
                    <thead>
                        <tr>
                            <th scope="col" class="moda-table-th">#</th>
                            <th scope="col" class="moda-table-th">SKU</th>
                            <th scope="col" class="moda-table-th">PRODUCTO</th>
                            <th scope="col" class="moda-table-th">MARCA / CATEGORÍA</th>
                            <th scope="col" class="moda-table-th text-center">TALLA / COLOR</th>
                            <th scope="col" class="moda-table-th text-center">STOCK MIN.</th>
                            <th scope="col" class="moda-table-th text-center">STOCK ACT.</th>
                            <th scope="col" class="moda-table-th text-center">PRECIO VENTA</th>
                            <th scope="col" class="moda-table-th text-center">ESTADO</th>
                            <th scope="col" class="moda-table-th text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(variante, index) in inventarioFiltrado" :key="variante.sku + '-' + index" 
                            :class="getEstadoRowClass(variante.stock_actual, variante.stock_minimo)">
                            
                            <td class="moda-table-td text-center">{{ index + 1 }}</td>
                            
                            <td class="moda-table-td">
                                <span class="moda-badge moda-badge-sku">
                                    {{ variante.sku }}
                                </span>
                            </td>
                            
                            <td class="moda-table-td">
                                <div class="moda-product-name">{{ variante.producto }}</div>
                                <div class="moda-product-desc" v-if="variante.descripcion">
                                    {{ variante.descripcion.substring(0, 50) }}...
                                </div>
                            </td>
                            
                            <td class="moda-table-td">
                                <div class="moda-tags">
                                    <span class="moda-tag moda-tag-brand">{{ variante.marca }}</span>
                                    <span class="moda-tag moda-tag-category">{{ variante.categoria }}</span>
                                </div>
                            </td>

                            <td class="moda-table-td text-center">
                                <div class="moda-variant-info">
                                    <span class="moda-badge moda-badge-size">{{ variante.talla }}</span>
                                    <span class="moda-badge moda-badge-color" :style="{ 
                                        backgroundColor: getColorHex(variante.color),
                                        color: getContrastColor(variante.color)
                                    }">
                                        {{ variante.color }}
                                    </span>
                                </div>
                            </td>

                            <td class="moda-table-td text-center">
                                <span class="moda-badge moda-badge-secondary">{{ variante.stock_minimo }}</span>
                            </td>

                            <td class="moda-table-td text-center">
                                <span class="moda-stock-count" :class="getStockCountClass(variante.stock_actual, variante.stock_minimo)">
                                    {{ variante.stock_actual }}
                                </span>
                            </td>

                            <td class="moda-table-td text-center">
                                <span class="moda-price">
                                    ${{ (variante.precio_venta || 0).toFixed(2) }}
                                </span>
                            </td>

                            <td class="moda-table-td text-center">
                                <span :class="getEstadoBadgeClass(variante.stock_actual, variante.stock_minimo)">
                                    {{ getEstadoStock(variante.stock_actual, variante.stock_minimo) }}
                                </span>
                            </td>
                            
                            <td class="moda-table-td text-center">
                                <div class="moda-action-buttons-small">
                                    <button class="btn moda-btn-icon" title="Editar">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button class="btn moda-btn-icon moda-btn-icon-primary" title="Ingreso de stock">
                                        <i class="bi bi-arrow-up"></i>
                                    </button>
                                    <button class="btn moda-btn-icon moda-btn-icon-info" title="Ver detalles">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pie de tabla -->
            <div class="moda-table-footer">
                <div class="moda-status-legend">
                    <span class="moda-legend-item moda-legend-out">Agotado</span>
                    <span class="moda-legend-item moda-legend-low">REORDENAR</span>
                    <span class="moda-legend-item moda-legend-ok">Suficiente</span>
                </div>
                <div class="moda-update-time">
                    Última actualización: {{ new Date().toLocaleTimeString('es-VE') }}
                </div>
            </div>
        </div>

        <!-- Estado vacío -->
        <div v-else class="moda-empty-state">
            <div class="moda-empty-icon">
                <i class="bi bi-inbox"></i>
            </div>
            <h4 class="moda-empty-title">Inventario vacío</h4>
            <p class="moda-empty-text">No se encontraron productos en el inventario.</p>
            <button @click="router.push('/registroProducto')" class="btn moda-btn-primary">
                <i class="bi bi-plus-circle me-2"></i> Agregar Primer Producto
            </button>
        </div>
    </div>
</template>

<script setup>
import Header from './Header.vue';
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

// Función auxiliar para colores
const getColorHex = (colorName) => {
    const colors = {
        'negro': '#000000',
        'blanco': '#FFFFFF',
        'rojo': '#FF0000',
        'azul': '#0000FF',
        'verde': '#00FF00',
        'amarillo': '#FFFF00',
        'naranja': '#FFA500',
        'morado': '#800080',
        'rosa': '#FFC0CB',
        'gris': '#808080',
        'marrón': '#8B4513',
        'beige': '#F5F5DC'
    };
    return colors[colorName?.toLowerCase()] || '#D6CFC8';
};

const getContrastColor = (colorName) => {
    const darkColors = ['blanco', 'amarillo', 'beige'];
    return darkColors.includes(colorName?.toLowerCase()) ? '#3A2E2A' : '#FFFDFB';
};

const transformarDatosInventario = (productos) => {
    const variantesLista = [];
    
    productos.forEach(producto => {
        if (producto.variantes && Array.isArray(producto.variantes)) {
            producto.variantes.forEach(variante => {
                variantesLista.push({
                    sku: variante.sku || `SKU-${producto.id_producto}-${variante.id_variante}`,
                    producto: producto.nombre || 'Sin nombre',
                    marca: producto.marca || 'Sin marca',
                    categoria: producto.categoria || 'Sin categoría',
                    talla: variante.talla || 'N/A',
                    color: variante.color || 'N/A',
                    stock_minimo: 10,
                    stock_actual: variante.stock_actual || 0,
                    precio_venta: Number(variante.precio_unitario_venta) || 0,
                    id_producto: producto.id_producto,
                    id_variante: variante.id_variante,
                    descripcion: producto.descripcion || ''
                });
            });
        } else {
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

const getEstadoRowClass = (stockActual, stockMinimo) => {
    const estado = getEstadoStock(stockActual, stockMinimo);
    switch(estado) {
        case 'Agotado': return 'moda-row-out';
        case 'REORDENAR': return 'moda-row-low';
        default: return 'moda-row-ok';
    }
};

const getStockCountClass = (stockActual, stockMinimo) => {
    const estado = getEstadoStock(stockActual, stockMinimo);
    switch(estado) {
        case 'Agotado': return 'moda-stock-out';
        case 'REORDENAR': return 'moda-stock-low';
        default: return 'moda-stock-ok';
    }
};

const getEstadoBadgeClass = (stockActual, stockMinimo) => {
    const estado = getEstadoStock(stockActual, stockMinimo);
    switch(estado) {
        case 'Agotado': return 'moda-badge moda-badge-danger';
        case 'REORDENAR': return 'moda-badge moda-badge-warning';
        default: return 'moda-badge moda-badge-success';
    }
};

const cargarInventario = async () => {
    loading.value = true;
    errorConexion.value = false;
    try {
        const data = await obtenerTodoElInventario();
        
        if (Array.isArray(data)) {
            inventarioList.value = transformarDatosInventario(data);
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
                sku: 'ZAP-RUN-42',
                producto: 'Camisa Clásica de Algodón',
                marca: 'Puma',
                categoria: 'Camisa',
                talla: '42',
                color: 'Negro',
                stock_minimo: 10,
                stock_actual: 27,
                precio_venta: 9000,
                descripcion: 'Camisa de vestir premium'
            },
            {
                sku: 'CODI-BL-MJ',
                producto: 'Camisa Clásica de Algodón',
                marca: 'Puma',
                categoria: 'Camisa',
                talla: '14',
                color: 'Blanco',
                stock_minimo: 10,
                stock_actual: 9,
                precio_venta: 9000,
                descripcion: 'Camisa de vestir casual'
            },
            {
                sku: 'ZAP-RUN-42',
                producto: 'Camisa Clásica de Algodón',
                marca: 'Puma',
                categoria: 'Camisa',
                talla: '42',
                color: 'Negro',
                stock_minimo: 10,
                stock_actual: 0,
                precio_venta: 9000,
                descripcion: 'Camisa de vestir deportiva'
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

<style scoped>
/* Contenedor principal */
.moda-main-container {
    background-color: #FFFDFB;
    border-radius: 14px;
    border: 1px solid #D6CFC8;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(74, 59, 52, 0.1);
    margin: 1rem auto;
}

/* Título */
.moda-title {
    color: #3A2E2A;
    font-weight: 700;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #D6CFC8;
}

.moda-icon-primary {
    color: #4A3B34;
}

/* Barra de acciones */
.moda-action-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    align-items: center;
    justify-content: space-between;
    background-color: #F8F5F2;
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid #D6CFC8;
}

.moda-search-container {
    flex: 1;
    min-width: 250px;
}

.moda-search-group {
    position: relative;
    width: 100%;
}

.moda-search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #8B7355;
}

.moda-search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 2px solid #D6CFC8;
    border-radius: 8px;
    background-color: white;
    color: #3A2E2A;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.moda-search-input:focus {
    border-color: #4A3B34;
    box-shadow: 0 0 0 3px rgba(74, 59, 52, 0.2);
    outline: none;
}

.moda-action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

/* Botones */
.btn {
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    border: 2px solid;
}

.moda-btn-outline-success {
    background-color: transparent;
    border-color: #198754;
    color: #198754;
}

.moda-btn-outline-success:hover {
    background-color: #198754;
    color: white;
    transform: translateY(-2px);
}

.moda-btn-outline {
    background-color: transparent;
    border-color: #8B7355;
    color: #8B7355;
}

.moda-btn-outline:hover {
    background-color: #8B7355;
    color: white;
    transform: translateY(-2px);
}

.moda-btn-outline-primary {
    background-color: transparent;
    border-color: #4A3B34;
    color: #4A3B34;
}

.moda-btn-outline-primary:hover {
    background-color: #4A3B34;
    color: white;
    transform: translateY(-2px);
}

.moda-btn-outline-secondary {
    background-color: transparent;
    border-color: #D6CFC8;
    color: #3A2E2A;
}

.moda-btn-outline-secondary:hover {
    background-color: #D6CFC8;
    color: #3A2E2A;
    transform: translateY(-2px);
}

.moda-btn-primary {
    background-color: #4A3B34;
    border-color: #4A3B34;
    color: white;
}

.moda-btn-primary:hover {
    background-color: #352822;
    border-color: #352822;
    transform: translateY(-2px);
}

/* Tabla */
.moda-table-header {
    background-color: #F8F5F2;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #D6CFC8;
    margin-bottom: 1rem;
}

.moda-table-count {
    color: #8B7355;
    margin: 0;
    font-size: 0.9rem;
}

.moda-filter-note {
    color: #4A3B34;
    font-weight: 500;
}

.moda-table-container {
    background-color: white;
    border-radius: 10px;
    border: 1px solid #D6CFC8;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(74, 59, 52, 0.08);
    margin-bottom: 1rem;
}

.moda-table {
    width: 100%;
    border-collapse: collapse;
}

.moda-table-th {
    background: linear-gradient(135deg, #4A3B34, #5D4A3A);
    color: white;
    padding: 1rem;
    font-weight: 600;
    text-align: left;
    border: none;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.moda-table-td {
    padding: 1rem;
    color: #3A2E2A;
    border-bottom: 1px solid #D6CFC8;
    vertical-align: middle;
}

/* Clases para filas según estado */
.moda-row-out {
    background-color: rgba(220, 53, 69, 0.05);
}

.moda-row-low {
    background-color: rgba(255, 193, 7, 0.05);
}

.moda-row-ok {
    background-color: white;
}

.moda-row-out:hover,
.moda-row-low:hover,
.moda-row-ok:hover {
    background-color: rgba(139, 115, 85, 0.05);
    transform: translateY(-1px);
    transition: all 0.2s ease;
}

/* Badges */
.moda-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.moda-badge-sku {
    background-color: rgba(139, 115, 85, 0.15);
    color: #8B7355;
    border: 1px solid #D6CFC8;
}

.moda-badge-secondary {
    background-color: rgba(214, 207, 200, 0.3);
    color: #3A2E2A;
}

.moda-badge-size {
    background-color: #4A3B34;
    color: white;
    margin-right: 0.25rem;
}

.moda-badge-color {
    border: 1px solid #D6CFC8;
}

.moda-badge-danger {
    background-color: #dc3545;
    color: white;
}

.moda-badge-warning {
    background-color: #ffc107;
    color: #3A2E2A;
}

.moda-badge-success {
    background-color: #198754;
    color: white;
}

/* Información del producto */
.moda-product-name {
    font-weight: 600;
    color: #3A2E2A;
    margin-bottom: 0.25rem;
}

.moda-product-desc {
    color: #8B7355;
    font-size: 0.85rem;
    line-height: 1.4;
}

/* Tags */
.moda-tags {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.moda-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    width: fit-content;
}

.moda-tag-brand {
    background-color: rgba(74, 59, 52, 0.1);
    color: #4A3B34;
}

.moda-tag-category {
    background-color: rgba(139, 115, 85, 0.1);
    color: #8B7355;
}

/* Stock */
.moda-stock-count {
    font-weight: 600;
    font-size: 1.1rem;
}

.moda-stock-out {
    color: #dc3545;
}

.moda-stock-low {
    color: #ffc107;
}

.moda-stock-ok {
    color: #198754;
}

/* Precio */
.moda-price {
    font-weight: 600;
    color: #198754;
    font-size: 1rem;
}

/* Botones de acción */
.moda-action-buttons-small {
    display: flex;
    gap: 0.25rem;
    justify-content: center;
}

.moda-btn-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid #D6CFC8;
    background-color: transparent;
    color: #8B7355;
}

.moda-btn-icon:hover {
    background-color: #D6CFC8;
    color: #3A2E2A;
    transform: translateY(-2px);
}

.moda-btn-icon-primary {
    border-color: #4A3B34;
    color: #4A3B34;
}

.moda-btn-icon-primary:hover {
    background-color: #4A3B34;
    color: white;
}

.moda-btn-icon-info {
    border-color: #0dcaf0;
    color: #0dcaf0;
}

.moda-btn-icon-info:hover {
    background-color: #0dcaf0;
    color: white;
}

/* Pie de tabla */
.moda-table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: #F8F5F2;
    border-radius: 8px;
    border: 1px solid #D6CFC8;
    font-size: 0.85rem;
}

.moda-status-legend {
    display: flex;
    gap: 1rem;
}

.moda-legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #8B7355;
}

.moda-legend-item::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.moda-legend-out::before {
    background-color: #dc3545;
}

.moda-legend-low::before {
    background-color: #ffc107;
}

.moda-legend-ok::before {
    background-color: #198754;
}

.moda-update-time {
    color: #8B7355;
}

/* Estado vacío */
.moda-empty-state {
    text-align: center;
    padding: 3rem;
    background-color: #F8F5F2;
    border-radius: 10px;
    border: 2px dashed #D6CFC8;
}

.moda-empty-icon {
    font-size: 3rem;
    color: #D6CFC8;
    margin-bottom: 1rem;
}

.moda-empty-title {
    color: #3A2E2A;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.moda-empty-text {
    color: #8B7355;
    margin-bottom: 1.5rem;
}

/* Alertas y estados */
.moda-alert {
    padding: 1rem 1.5rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    border: 1px solid;
    display: flex;
    align-items: center;
}

.moda-alert-error {
    background-color: rgba(220, 53, 69, 0.1);
    border-color: #dc3545;
    color: #dc3545;
}

.moda-loading-state {
    text-align: center;
    padding: 3rem;
}

.moda-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #D6CFC8;
    border-top-color: #4A3B34;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.moda-subtitle {
    color: #8B7355;
    font-weight: 500;
    font-size: 1rem;
}

/* Responsive */
@media (max-width: 1200px) {
    .moda-table-container {
        overflow-x: auto;
    }
    
    .moda-table {
        min-width: 1100px;
    }
}

@media (max-width: 768px) {
    .moda-main-container {
        padding: 1rem;
    }
    
    .moda-action-bar {
        flex-direction: column;
        align-items: stretch;
    }
    
    .moda-search-container {
        width: 100%;
    }
    
    .moda-action-buttons {
        justify-content: center;
    }
    
    .moda-table-footer {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .moda-status-legend {
        justify-content: center;
    }
}

@media (max-width: 576px) {
    .moda-title {
        font-size: 1.5rem;
    }
    
    .moda-action-buttons {
        flex-direction: column;
    }
    
    .moda-action-buttons .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>