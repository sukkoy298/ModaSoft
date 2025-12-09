<template>
  <Header />
  <div class="container moda-main-container mt-5 mb-5">
    <h1 class="moda-title text-center mb-4">Gestión de Compras</h1>
    
    <!-- Pestañas estilo Moda -->
    <div class="moda-tabs-container mb-4">
      <div class="moda-tabs">
        <button 
          class="moda-tab"
          :class="{ 'active': pestañaActiva === 'nueva' }"
          @click="cambiarPestaña('nueva')"
        >
          <i class="bi bi-cart-plus me-2"></i> Nueva Compra
        </button>
        <button 
          class="moda-tab"
          :class="{ 'active': pestañaActiva === 'historial' }"
          @click="cambiarPestaña('historial')"
        >
          <i class="bi bi-clock-history me-2"></i> Historial
          <span class="moda-badge bg-primary">{{ compras.length }}</span>
        </button>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="moda-loading-state">
      <div class="moda-spinner"></div>
      <p class="mt-3 moda-subtitle">Cargando datos...</p>
    </div>

    <!-- Nueva Compra -->
    <div v-else-if="pestañaActiva === 'nueva'">
      <div class="moda-card mb-4">
        <div class="moda-card-body">
          <h5 class="moda-subtitle mb-3">
            <i class="bi bi-cart-plus me-2"></i> Nueva Compra a Proveedor
          </h5>
          
          <!-- Mensaje de resultado -->
          <div v-if="mensaje" :class="['moda-alert', esError ? 'moda-alert-error' : 'moda-alert-success']" role="alert">
            <i :class="['bi me-2', esError ? 'bi-exclamation-triangle' : 'bi-check-circle']"></i>
            {{ mensaje }}
          </div>
          
          <form @submit.prevent="registrarCompraEnComponente" class="moda-form-compra">
            <!-- Proveedor -->
            <div class="moda-form-group mb-4">
              <label class="moda-label">
                <i class="bi bi-person-vcard me-1"></i> Proveedor *
              </label>
              <select 
                v-model="nuevaCompra.cedula_proveedor" 
                class="moda-select"
                required
                @change="cargarProveedorSeleccionado"
              >
                <option value="">Seleccionar proveedor...</option>
                <option 
                  v-for="proveedor in proveedores" 
                  :key="proveedor.doc_identidad" 
                  :value="proveedor.doc_identidad"
                >
                  {{ proveedor.nombre }} ({{ proveedor.doc_identidad }})
                </option>
              </select>
              <div class="moda-feedback">
                Seleccione un proveedor
              </div>
              
              <!-- Info del proveedor seleccionado -->
              <div v-if="proveedorSeleccionado" class="moda-proveedor-info mt-2">
                <div class="row">
                  <div class="col-md-6">
                    <small class="moda-text-muted">
                      <i class="bi bi-telephone me-1"></i>
                      {{ proveedorSeleccionado.telefono || 'Sin teléfono' }}
                    </small>
                  </div>
                  <div class="col-md-6">
                    <small class="moda-text-muted">
                      <i class="bi bi-envelope me-1"></i>
                      {{ proveedorSeleccionado.email || 'Sin email' }}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información de factura -->
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="moda-form-group">
                  <label class="moda-label">
                    <i class="bi bi-receipt me-1"></i> Número de Factura *
                  </label>
                  <input 
                    type="number" 
                    v-model="nuevaCompra.nro_factura"
                    class="moda-input"
                    placeholder="Ej: 001-001-0000001"
                    required
                  >
                  <div class="moda-feedback">
                    Campo obligatorio
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="moda-form-group">
                  <label class="moda-label">
                    <i class="bi bi-calendar me-1"></i> Fecha de Compra
                  </label>
                  <input 
                    type="date" 
                    v-model="nuevaCompra.fecha"
                    class="moda-input"
                    :max="fechaHoy"
                  >
                  <div class="moda-feedback">
                    Por defecto: hoy
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalles de la compra -->
            <div class="moda-card mb-4">
              <div class="moda-card-header d-flex justify-content-between align-items-center">
                <h6 class="moda-subtitle mb-0">
                  <i class="bi bi-list-check me-2"></i> Detalles de Productos
                </h6>
                <button 
                  type="button" 
                  class="btn btn-sm btn-moda-primary"
                  @click="agregarDetalle"
                >
                  <i class="bi bi-plus-circle me-1"></i> Agregar Producto
                </button>
              </div>
              <div class="moda-card-body">
                <div v-if="detalles.length === 0" class="moda-alert moda-alert-info">
                  <i class="bi bi-info-circle me-2"></i>
                  Agregue productos a la compra
                </div>
                
                <div v-else class="table-responsive">
                  <table class="moda-table-sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-end">Precio Unitario</th>
                        <th class="text-end">Subtotal</th>
                        <th class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(detalle, index) in detalles" :key="index">
                        <td>
                          <input 
                            type="number" 
                            v-model="detalle.id_variante"
                            class="form-control form-control-sm"
                            placeholder="ID Variante"
                            @input="buscarProducto(index)"
                          >
                          <small v-if="detalle.productoInfo" class="text-success">
                            {{ detalle.productoInfo }}
                          </small>
                        </td>
                        <td class="text-center">
                          <div class="input-group input-group-sm">
                            <button 
                              type="button" 
                              class="btn btn-outline-secondary"
                              @click="(detalle.cantidad = Math.max(1, detalle.cantidad - 1), calcularTotales())"
                            >
                              <i class="bi bi-dash"></i>
                            </button>
                            <input 
                              type="number" 
                              v-model.number="detalle.cantidad"
                              min="1"
                              class="form-control text-center"
                              @input="calcularTotales"
                            >
                            <button 
                              type="button" 
                              class="btn btn-outline-secondary"
                              @click="(detalle.cantidad += 1, calcularTotales())"
                            >
                              <i class="bi bi-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td class="text-end">
                          <div class="input-group input-group-sm">
                            <span class="input-group-text">$</span>
                            <input 
                              type="number" 
                              v-model.number="detalle.precio_unitario_costo"
                              step="0.01"
                              min="0"
                              class="form-control text-end"
                              @input="calcularTotales"
                            >
                          </div>
                        </td>
                        <td class="text-end align-middle">
                          <span class="fw-semibold">
                            ${{ (detalle.cantidad * detalle.precio_unitario_costo).toFixed(2) }}
                          </span>
                        </td>
                        <td class="text-center align-middle">
                          <button 
                            type="button"
                            class="btn btn-sm btn-link text-danger"
                            @click="eliminarDetalle(index)"
                            title="Eliminar"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Resumen de totales -->
            <div class="row justify-content-end mb-4">
              <div class="col-md-6">
                <div class="moda-card">
                  <div class="moda-card-body">
                    <h6 class="moda-subtitle mb-3">Resumen de Totales</h6>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-muted">Subtotal:</span>
                      <span class="fw-semibold">${{ nuevaCompra.subtotal.toFixed(2) }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-muted">IVA (16%):</span>
                      <span class="fw-semibold">${{ nuevaCompra.iva.toFixed(2) }}</span>
                    </div>
                    <div class="d-flex justify-content-between border-top pt-2">
                      <span class="fw-bold">Total:</span>
                      <span class="h5 fw-bold text-success">${{ nuevaCompra.total.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="moda-form-actions">
              <button 
                type="button" 
                class="btn moda-btn-outline-secondary"
                @click="limpiarFormulario"
                :disabled="procesando"
              >
                <i class="bi bi-eraser me-2"></i> Limpiar
              </button>
              <button 
                type="submit" 
                class="btn moda-btn-primary"
                :disabled="!puedeRegistrar || procesando"
              >
                <i class="bi" :class="procesando ? 'bi-hourglass-split' : 'bi-check-circle'"></i>
                {{ procesando ? 'Procesando...' : 'Registrar Compra' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Historial de Compras -->
    <div v-else-if="pestañaActiva === 'historial'">
      <!-- Filtros -->
      <div class="moda-card mb-4">
        <div class="moda-card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="moda-label">Filtrar por Proveedor:</label>
              <select v-model="filtroProveedor" class="moda-select" @change="filtrarCompras">
                <option value="">Todos los proveedores</option>
                <option 
                  v-for="proveedor in proveedores" 
                  :key="proveedor.doc_identidad" 
                  :value="proveedor.doc_identidad"
                >
                  {{ proveedor.nombre }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="moda-label">Fecha Desde:</label>
              <input type="date" v-model="filtroFechaInicio" class="moda-input" @change="filtrarCompras">
            </div>
            <div class="col-md-4">
              <label class="moda-label">Fecha Hasta:</label>
              <input type="date" v-model="filtroFechaFin" class="moda-input" @change="filtrarCompras">
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="moda-stat-card">
            <div class="moda-stat-icon bg-primary">
              <i class="bi bi-cart-check"></i>
            </div>
            <div class="moda-stat-info">
              <div class="moda-stat-number">{{ comprasFiltradas.length }}</div>
              <div class="moda-stat-label">Compras Totales</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="moda-stat-card">
            <div class="moda-stat-icon bg-success">
              <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="moda-stat-info">
              <div class="moda-stat-number">${{ totalCompras.toFixed(2) }}</div>
              <div class="moda-stat-label">Monto Total</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="moda-stat-card">
            <div class="moda-stat-icon bg-warning">
              <i class="bi bi-box-seam"></i>
            </div>
            <div class="moda-stat-info">
              <div class="moda-stat-number">{{ totalProductos }}</div>
              <div class="moda-stat-label">Productos Comprados</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="moda-stat-card">
            <div class="moda-stat-icon bg-info">
              <i class="bi bi-people"></i>
            </div>
            <div class="moda-stat-info">
              <div class="moda-stat-number">{{ proveedoresUnicos }}</div>
              <div class="moda-stat-label">Proveedores</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de compras -->
      <div class="moda-card">
        <div class="moda-card-header d-flex justify-content-between align-items-center">
          <h6 class="moda-subtitle mb-0">
            <i class="bi bi-clock-history me-2"></i> Historial de Compras
          </h6>
          <div class="input-group" style="max-width: 300px;">
            <input 
              type="text" 
              class="form-control form-control-sm moda-input" 
              placeholder="Buscar compra..."
              v-model="busqueda"
              @input="filtrarCompras"
            >
            <button class="btn btn-sm btn-moda-outline" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
        
        <div class="moda-table-container">
          <table class="moda-table">
            <thead>
              <tr>
                <th class="text-center">ID</th>
                <th>Proveedor</th>
                <th class="text-center">Fecha</th>
                <th class="text-center">Factura</th>
                <th class="text-end">Subtotal</th>
                <th class="text-end">IVA</th>
                <th class="text-end">Total</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="compra in comprasFiltradasPagadas" :key="compra.id_compra">
                <td class="text-center">#{{ compra.id_compra }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-person-circle me-2 moda-icon"></i>
                    <div>
                      <div class="fw-semibold">{{ compra.Proveedor?.nombre || 'N/A' }}</div>
                      <div class="small text-muted">{{ compra.cedula_proveedor }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  {{ formatearFecha(compra.fecha) }}
                </td>
                <td class="text-center">
                  <span class="badge badge-moda">{{ compra.nro_factura }}</span>
                </td>
                <td class="text-end">${{ Number(compra.subtotal).toFixed(2) }}</td>
                <td class="text-end">${{ Number(compra.iva).toFixed(2) }}</td>
                <td class="text-end">
                  <span class="fw-bold text-success">${{ Number(compra.total).toFixed(2) }}</span>
                </td>
                <td class="text-center">
                  <button 
                    class="btn btn-sm btn-moda-action btn-info me-1"
                    @click="verDetalleCompra(compra.id_compra)"
                    title="Ver detalles"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-moda-action btn-delete"
                    @click="manejarEliminacion(compra.id_compra, compra.Proveedor?.nombre)"
                    title="Eliminar compra"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sin compras -->
        <div v-if="comprasFiltradas.length === 0" class="text-center py-5">
          <i class="bi bi-cart-x fs-1 text-muted mb-3 d-block"></i>
          <h5 class="moda-subtitle">No hay compras registradas</h5>
          <p class="text-muted">Comienza registrando tu primera compra</p>
        </div>

        <!-- Paginación -->
        <div v-if="comprasFiltradas.length > 0" class="d-flex justify-content-between align-items-center p-3 border-top">
          <div class="text-muted small">
            Mostrando {{ Math.min(comprasFiltradas.length, 10) }} de {{ comprasFiltradas.length }} compras
          </div>
          <nav aria-label="Paginación de compras">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item">
                <a class="page-link" href="#" @click.prevent="paginaActual = Math.max(1, paginaActual - 1)">
                  <i class="bi bi-chevron-left"></i>
                </a>
              </li>
              <li 
                v-for="page in paginas" 
                :key="page" 
                class="page-item" 
                :class="{ active: page === paginaActual }"
              >
                <a class="page-link" href="#" @click.prevent="paginaActual = page">{{ page }}</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#" @click.prevent="paginaActual = Math.min(paginas, paginaActual + 1)">
                  <i class="bi bi-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import { 
    obtenerTodasLasCompras,
    registrarCompra,
    eliminarCompra,
    buscarProductosParaCompra,
    buscarProductoPorCodigo 
} from '@/compras.js'

import { 
    obtenerTodosLosProveedores 
} from '@/proveedor.js'

const router = useRouter()

// Estado
const pestañaActiva = ref('nueva')
const cargando = ref(true)
const procesando = ref(false)
const mensaje = ref('')
const esError = ref(false)

// Datos para nueva compra
const proveedores = ref([])
const proveedorSeleccionado = ref(null)
const nuevaCompra = ref({
  cedula_proveedor: '',
  nro_factura: '',
  fecha: new Date().toISOString().split('T')[0],
  subtotal: 0,
  iva: 0,
  total: 0,
  id_usuario: 1
})

const detalles = ref([])

// Datos para historial
const compras = ref([])
const comprasFiltradas = ref([])
const filtroProveedor = ref('')
const filtroFechaInicio = ref('')
const filtroFechaFin = ref('')
const busqueda = ref('')
const paginaActual = ref(1)
const itemsPorPagina = 10

// Computed
const fechaHoy = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const puedeRegistrar = computed(() => {
  return (
    nuevaCompra.value.cedula_proveedor &&
    nuevaCompra.value.nro_factura &&
    detalles.value.length > 0 &&
    detalles.value.every(d => d.id_variante && d.cantidad > 0 && d.precio_unitario_costo > 0)
  )
})

const comprasFiltradasPagadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  const fin = inicio + itemsPorPagina
  return comprasFiltradas.value.slice(inicio, fin)
})

const totalCompras = computed(() => {
  return comprasFiltradas.value.reduce((sum, compra) => sum + Number(compra.total), 0)
})

const totalProductos = computed(() => {
  return comprasFiltradas.value.reduce((sum, compra) => {
    if (compra.Detalles) {
      return sum + compra.Detalles.reduce((detSum, det) => detSum + Number(det.cantidad), 0)
    }
    return sum
  }, 0)
})

const proveedoresUnicos = computed(() => {
  const proveedoresSet = new Set(comprasFiltradas.value.map(c => c.cedula_proveedor))
  return proveedoresSet.size
})

const paginas = computed(() => {
  return Math.ceil(comprasFiltradas.value.length / itemsPorPagina)
})

// Métodos
const cambiarPestaña = (pestaña) => {
  pestañaActiva.value = pestaña
  if (pestaña === 'historial') {
    cargarCompras()
  }
}

const cargarProveedores = async () => {
  try {
    const data = await obtenerTodosLosProveedores()
    proveedores.value = data
  } catch (error) {
    console.error('Error al cargar proveedores:', error)
    mensaje.value = '❌ Error al cargar proveedores'
    esError.value = true
  }
}

const cargarProveedorSeleccionado = () => {
  proveedorSeleccionado.value = proveedores.value.find(
    p => p.doc_identidad === nuevaCompra.value.cedula_proveedor
  )
}

const cargarCompras = async () => {
  try {
    const data = await obtenerTodasLasCompras()
    compras.value = data
    comprasFiltradas.value = data
  } catch (error) {
    console.error('Error al cargar compras:', error)
    mensaje.value = '❌ Error al cargar historial de compras'
    esError.value = true
  }
}

const agregarDetalle = () => {
  detalles.value.push({
    id_variante: '',
    cantidad: 1,
    precio_unitario_costo: 0,
    productoInfo: ''
  })
  calcularTotales()
}

const eliminarDetalle = (index) => {
  detalles.value.splice(index, 1)
  calcularTotales()
}

const buscarProducto = async (index) => {
    const termino = detalles.value[index].id_variante;
    
    if (!termino || termino.length < 2) {
        detalles.value[index].productoInfo = '';
        return;
    }

    try {
        // Intentar primero como código de barras exacto
        if (termino.length >= 5 && /^[A-Za-z0-9]+$/.test(termino)) {
            try {
                const producto = await buscarProductoPorCodigo(termino);
        detalles.value[index].productoInfo = 
          `${producto.producto_nombre} - Talla: ${producto.talla} - Color: ${producto.color}`;
                
        // Si existe precio de venta, sugerir precio de costo (70% del precio de venta, redondeado a 2 decimales)
        if (producto.precio_unitario_venta && !detalles.value[index].precio_unitario_costo) {
          detalles.value[index].precio_unitario_costo = Number((producto.precio_unitario_venta * 0.7).toFixed(2));
        }

        // Solo asignar id_variante automáticamente si el campo estaba vacío antes de la búsqueda
        if (!detalles.value[index]._id_variante_original) {
          detalles.value[index]._id_variante_original = detalles.value[index].id_variante;
        }
        if (!detalles.value[index]._id_variante_original && producto.id_variante) {
          detalles.value[index].id_variante = producto.id_variante;
        }
                
                // Mostrar stock disponible
                detalles.value[index].stockInfo = `Stock: ${producto.stock_actual}`;
                // Recalcular totales si la búsqueda rellenó el precio
                calcularTotales();
                return;
            } catch (error) {
                // Si no encuentra por código exacto, buscar por término
            }
        }

        // Búsqueda general
        const productos = await buscarProductosParaCompra(termino);
        
        if (productos && productos.length > 0) {
            // Mostrar el primer resultado
      const producto = productos[0];
      detalles.value[index].productoInfo = 
        `${producto.producto_nombre} - ${producto.codigo_barras}`;
            
            // Mostrar stock si existe
            if (producto.stock_actual !== undefined) {
                detalles.value[index].stockInfo = `Stock: ${producto.stock_actual}`;
            }
            
      // Sugerir precio si no está definido (redondeado a 2 decimales)
      if (producto.precio_unitario_venta && !detalles.value[index].precio_unitario_costo) {
        detalles.value[index].precio_unitario_costo = Number((producto.precio_unitario_venta * 0.7).toFixed(2));
      }

      // Solo asignar id_variante automáticamente si el campo estaba vacío antes de la búsqueda
      if (!detalles.value[index]._id_variante_original) {
        detalles.value[index]._id_variante_original = detalles.value[index].id_variante;
      }
      if (!detalles.value[index]._id_variante_original && producto.id_variante) {
        detalles.value[index].id_variante = producto.id_variante;
      }
      // Recalcular totales si se asignó precio/id_variante automáticamente
      calcularTotales();
            
            // Mostrar opciones si hay más resultados
            if (productos.length > 1) {
                console.log(`${productos.length} productos encontrados para "${termino}"`);
            }
        } else {
            detalles.value[index].productoInfo = 'Producto no encontrado';
            detalles.value[index].stockInfo = '';
        }
    } catch (error) {
        console.error('Error buscando producto:', error);
        detalles.value[index].productoInfo = 'Error en búsqueda';
        detalles.value[index].stockInfo = '';
    }
};

const calcularTotales = () => {
  // Calcular subtotal
  nuevaCompra.value.subtotal = detalles.value.reduce((sum, detalle) => {
    return sum + (parseFloat(detalle.precio_unitario_costo) || 0) * (parseInt(detalle.cantidad) || 0);
  }, 0);

  // Calcular IVA (16%)
  nuevaCompra.value.iva = nuevaCompra.value.subtotal * 0.16;
  
  // Calcular total
  nuevaCompra.value.total = nuevaCompra.value.subtotal + nuevaCompra.value.iva;
  
  console.log('💰 Totales calculados:', {
    subtotal: nuevaCompra.value.subtotal,
    iva: nuevaCompra.value.iva,
    total: nuevaCompra.value.total
  });
}

const registrarCompraEnComponente = async () => {
  procesando.value = true
  mensaje.value = ''
  esError.value = false

  try {
    calcularTotales(); // Asegúrate que esto se ejecute primero

    // VALIDACIÓN EXTRA DE DETALLES
    const detallesInvalidos = detalles.value.filter(d => {
      return (
        !d.id_variante || isNaN(Number(d.id_variante)) || Number(d.id_variante) <= 0 ||
        !d.cantidad || isNaN(Number(d.cantidad)) || Number(d.cantidad) <= 0 ||
        !d.precio_unitario_costo || isNaN(Number(d.precio_unitario_costo)) || Number(d.precio_unitario_costo) <= 0
      );
    });
    if (detallesInvalidos.length > 0) {
      mensaje.value = '❌ Hay productos con datos inválidos (ID, cantidad o precio). Corrija antes de registrar.';
      esError.value = true;
      procesando.value = false;
      return;
    }

    // PREPARAR PAYLOAD CORRECTAMENTE
    const payload = {
      cedula_proveedor: nuevaCompra.value.cedula_proveedor,
      nro_factura: nuevaCompra.value.nro_factura,
      fecha: nuevaCompra.value.fecha,
      id_usuario: nuevaCompra.value.id_usuario,
      subtotal: nuevaCompra.value.subtotal || 0,
      iva: nuevaCompra.value.iva || 0,
      total: nuevaCompra.value.total || 0,
      detalles: detalles.value.map(d => ({
        id_variante: parseInt(d.id_variante) || 0,
        cantidad: parseInt(d.cantidad) || 1,
        precio_unitario_costo: parseFloat(d.precio_unitario_costo) || 0
      }))
    };

  console.log('📤 Datos a enviar:', JSON.stringify(payload, null, 2));

    // INTENTAR REGISTRAR
    const resultado = await registrarCompra(payload);

    console.log('✅ Compra registrada:', resultado);

    // Resetear formulario
    detalles.value = [];
    limpiarFormulario();

    mensaje.value = '✅ Compra registrada exitosamente!';
    esError.value = false;

    // Cambiar a historial después de 2 segundos
    setTimeout(() => {
      pestañaActiva.value = 'historial';
      cargarCompras();
    }, 2000);

  } catch (error) {
    console.error('❌ Error completo:', error);

    // Mostrar mensaje específico
    if (error.message.includes('400')) {
      mensaje.value = '❌ Error en los datos enviados. Verifique la información.';
    } else if (error.message.includes('Network Error') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      mensaje.value = '❌ No se puede conectar con el servidor. Verifique que esté corriendo.';
    } else {
      mensaje.value = `❌ ${error.message}`;
    }

    esError.value = true;

  } finally {
    procesando.value = false;
  }
}

const limpiarFormulario = () => {
  nuevaCompra.value = {
    cedula_proveedor: '',
    nro_factura: '',
    fecha: new Date().toISOString().split('T')[0],
    subtotal: 0,
    iva: 0,
    total: 0,
    id_usuario: 1
  }
  proveedorSeleccionado.value = null
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  try {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    return 'Fecha inválida'
  }
}

const filtrarCompras = () => {
  let filtradas = compras.value

  // Filtrar por proveedor
  if (filtroProveedor.value) {
    filtradas = filtradas.filter(c => c.cedula_proveedor === filtroProveedor.value)
  }

  // Filtrar por fecha
  if (filtroFechaInicio.value) {
    filtradas = filtradas.filter(c => new Date(c.fecha) >= new Date(filtroFechaInicio.value))
  }
  
  if (filtroFechaFin.value) {
    filtradas = filtradas.filter(c => new Date(c.fecha) <= new Date(filtroFechaFin.value))
  }

  // Filtrar por búsqueda
  if (busqueda.value) {
    const term = busqueda.value.toLowerCase()
    filtradas = filtradas.filter(c => 
      (c.nro_factura && c.nro_factura.toString().toLowerCase().includes(term)) ||
      (c.cedula_proveedor && c.cedula_proveedor.toLowerCase().includes(term)) ||
      (c.Proveedor?.nombre && c.Proveedor.nombre.toLowerCase().includes(term))
    )
  }

  comprasFiltradas.value = filtradas
  paginaActual.value = 1
}

const verDetalleCompra = (id_compra) => {
  // Aquí podrías implementar un modal o vista de detalle
  alert(`Ver detalle de compra #${id_compra}`)
  // O podrías redirigir a una vista de detalle:
  // router.push(`/compras/detalle/${id_compra}`)
}

const manejarEliminacion = async (id_compra, nombreProveedor) => { 
  if (!window.confirm(`¿Está seguro de eliminar la compra #${id_compra} del proveedor ${nombreProveedor || 'N/A'}?`)) {
    return
  }

  try {
    const resultado = await eliminarCompra(id_compra)
    
    alert(`✅ Compra #${id_compra} eliminada correctamente.`)
    cargarCompras()
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Error al eliminar la compra.'
    alert(`❌ Fallo: ${errorMsg}`)
  }
}

onMounted(async () => {
  cargando.value = true
  await cargarProveedores()
  await cargarCompras()
  cargando.value = false
})
</script>

<style scoped>
/* Contenedor principal */
.moda-main-container {
  background-color: #FFFDFB;
  border-radius: 14px;
  border: 1px solid #D6CFC8;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(74, 59, 52, 0.1);
  margin: 2rem auto;
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

/* Pestañas */
.moda-tabs-container {
  background-color: #F8F5F2;
  border-radius: 10px;
  padding: 0.5rem;
}

.moda-tabs {
  display: flex;
  gap: 0.5rem;
}

.moda-tab {
  flex: 1;
  background-color: transparent;
  border: 2px solid transparent;
  color: #8B7355;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.moda-tab:hover {
  background-color: rgba(139, 115, 85, 0.1);
  color: #5D4A3A;
}

.moda-tab.active {
  background-color: #FFFDFB;
  border-color: #4A3B34;
  color: #4A3B34;
  box-shadow: 0 2px 8px rgba(74, 59, 52, 0.15);
}

.moda-badge {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

/* Tarjetas */
.moda-card {
  background-color: #F8F5F2;
  border-radius: 12px;
  border: 1px solid #D6CFC8;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.moda-card:hover {
  box-shadow: 0 4px 12px rgba(74, 59, 52, 0.15);
}

.moda-card-body {
  padding: 1.5rem;
}

.moda-card-header {
  background-color: #FFFDFB;
  border-bottom: 1px solid #D6CFC8;
  padding: 1rem 1.5rem;
  border-radius: 12px 12px 0 0;
}

/* Subtítulos */
.moda-subtitle {
  color: #8B7355;
  font-weight: 500;
  font-size: 1rem;
}

/* Alertas */
.moda-alert {
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid;
  display: flex;
  align-items: center;
}

.moda-alert-success {
  background-color: rgba(25, 135, 84, 0.1);
  border-color: #198754;
  color: #198754;
}

.moda-alert-error {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: #dc3545;
  color: #dc3545;
}

.moda-alert-info {
  background-color: rgba(139, 115, 85, 0.1);
  border-color: #8B7355;
  color: #8B7355;
}

/* Formulario */
.moda-form-compra {
  padding: 1rem 0;
}

.moda-form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.moda-label {
  color: #3A2E2A;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.moda-input,
.moda-select {
  background-color: white;
  border: 2px solid #D6CFC8;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #3A2E2A;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

.moda-input:focus,
.moda-select:focus {
  border-color: #4A3B34;
  box-shadow: 0 0 0 3px rgba(74, 59, 52, 0.2);
  outline: none;
}

.moda-feedback {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  padding-left: 0.5rem;
  color: #8B7355;
}

/* Información del proveedor */
.moda-proveedor-info {
  background-color: rgba(139, 115, 85, 0.05);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border-left: 3px solid #4A3B34;
}

.moda-text-muted {
  color: #8B7355;
  font-size: 0.85rem;
}

/* Tabla pequeña para detalles */
.moda-table-sm {
  width: 100%;
  border-collapse: collapse;
}

.moda-table-sm th {
  background-color: #F8F5F2;
  color: #3A2E2A;
  padding: 0.5rem;
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid #D6CFC8;
  font-size: 0.85rem;
}

.moda-table-sm td {
  padding: 0.75rem 0.5rem;
  color: #3A2E2A;
  border-bottom: 1px solid #F8F5F2;
  vertical-align: middle;
}

.moda-table-sm tr:hover {
  background-color: rgba(139, 115, 85, 0.03);
}

/* Tabla principal */
.moda-table-container {
  background-color: white;
  border-radius: 10px;
  border: 1px solid #D6CFC8;
  overflow: hidden;
}

.moda-table {
  width: 100%;
  border-collapse: collapse;
}

.moda-table th {
  background: linear-gradient(135deg, #4A3B34, #5D4A3A);
  color: white;
  padding: 1rem;
  font-weight: 600;
  text-align: left;
  border: none;
  font-size: 0.85rem;
}

.moda-table td {
  padding: 1rem;
  color: #3A2E2A;
  border-bottom: 1px solid #D6CFC8;
  vertical-align: middle;
}

.moda-table tr:hover {
  background-color: rgba(139, 115, 85, 0.05);
}

/* Badges */
.badge-moda {
  background-color: #4A3B34 !important;
  color: white !important;
  border-radius: 20px;
  padding: 0.35em 0.85em;
  font-size: 0.75em;
}

/* Botones */
.btn-moda-primary {
  background-color: #4A3B34 !important;
  border-color: #4A3B34 !important;
  color: white !important;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-moda-primary:hover:not(:disabled) {
  background-color: #352822 !important;
  border-color: #352822 !important;
  transform: translateY(-2px);
}

.btn-moda-outline {
  background-color: transparent !important;
  border: 2px solid #4A3B34 !important;
  color: #4A3B34 !important;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-moda-outline:hover {
  background-color: #4A3B34 !important;
  color: white !important;
  transform: translateY(-2px);
}

.btn-moda-action {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.2s ease;
}

.btn-info {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.btn-info:hover {
  background-color: #0d6efd;
  color: white;
}

.btn-delete {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
}

/* Botones de acción del formulario */
.moda-form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #D6CFC8;
}

.moda-btn-primary {
  background-color: #4A3B34 !important;
  border-color: #4A3B34 !important;
  color: white !important;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.moda-btn-primary:hover:not(:disabled) {
  background-color: #352822 !important;
  border-color: #352822 !important;
  transform: translateY(-2px);
}

.moda-btn-outline-secondary {
  background-color: transparent !important;
  border: 2px solid #8B7355 !important;
  color: #8B7355 !important;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.moda-btn-outline-secondary:hover:not(:disabled) {
  background-color: #8B7355 !important;
  color: white !important;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Tarjetas de estadísticas */
.moda-stat-card {
  background-color: #F8F5F2;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #D6CFC8;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  height: 100%;
}

.moda-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(74, 59, 52, 0.1);
}

.moda-stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.bg-primary { background-color: #4A3B34; }
.bg-success { background-color: #198754; }
.bg-warning { background-color: #ffc107; }
.bg-info { background-color: #0dcaf0; }

.moda-stat-info {
  flex: 1;
}

.moda-stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3A2E2A;
}

.moda-stat-label {
  font-size: 0.85rem;
  color: #8B7355;
  margin-top: 0.25rem;
}

/* Estado de carga */
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

/* Paginación */
.pagination .page-link {
  color: #4A3B34;
  border-color: #D6CFC8;
  border-radius: 8px;
  margin: 0 2px;
  padding: 0.25rem 0.5rem;
}

.pagination .page-link:hover {
  background-color: #D6CFC8;
  border-color: #4A3B34;
}

.pagination .active .page-link {
  background-color: #4A3B34;
  border-color: #4A3B34;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .moda-main-container {
    padding: 1.5rem;
    margin: 1rem auto;
  }
  
  .moda-tabs {
    flex-direction: column;
  }
  
  .moda-table-container {
    overflow-x: auto;
  }
  
  .moda-table {
    min-width: 800px;
  }
  
  .moda-form-actions {
    flex-direction: column;
  }
  
  .moda-form-actions button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .moda-title {
    font-size: 1.5rem;
  }
  
  .moda-card {
    padding: 1rem;
  }
  
  .moda-stat-card {
    margin-bottom: 1rem;
  }
}
</style>