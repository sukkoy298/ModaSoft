<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { obtenerClientePorCedula } from '@/cliente.js'
import { obtenerTodoElInventario } from '@/producto.js'
import Header from '@/components/Header.vue'; 
import Footer from '@/components/Footer.vue'; 
import axios from 'axios'

// Estado del componente
const cliente = ref(null)
const cedulaBusqueda = ref('')
const buscandoCliente = ref(false)

// Productos
const products = ref([])
const loadingProducts = ref(true)
const errorProducts = ref(false)
const busquedaProducto = ref('')

// Carrito
const cart = ref(JSON.parse(localStorage.getItem('modasoft_cart') || '[]'))

// Métodos de pago
const metodosPago = ref([])
const metodoPagoSeleccionado = ref('')
const cargandoMetodosPago = ref(false)

// Usuario (deberías obtenerlo del login)
const idUsuario = ref(1) // Cambia esto según tu sistema de autenticación

// Estado de facturación
const processing = ref(false)

// Computed
const total = computed(() => cart.value.reduce((s, i) => s + (i.product.price || 0) * i.qty, 0))

const productosFiltrados = computed(() => {
  if (!busquedaProducto.value) {
    return products.value
  }
  const busqueda = busquedaProducto.value.toLowerCase()
  return products.value.filter(p =>
    p.nombre?.toLowerCase().includes(busqueda)
  )
})

// Funciones del carrito
function saveCart() {
  localStorage.setItem('modasoft_cart', JSON.stringify(cart.value))
}

function addToCart({ variant, qty, productName }) {
  // Verificar stock disponible antes de agregar
  const stockDisponible = variant.stock_actual || 0
  const cantidadSolicitada = Number(qty)
  
  if (stockDisponible < cantidadSolicitada) {
    alert(`Stock insuficiente. Disponible: ${stockDisponible}`)
    return
  }

  const existing = cart.value.find(i => i.product.id_variante === variant.id_variante)
  if (existing) {
    const nuevaCantidad = Number(existing.qty) + cantidadSolicitada
    if (nuevaCantidad > stockDisponible) {
      alert(`No hay suficiente stock. Disponible: ${stockDisponible}`)
      return
    }
    existing.qty = nuevaCantidad
  } else {
    cart.value.push({
      product: {
        id_variante: variant.id_variante,
        sku: variant.sku,
        nombre: productName,
        variante_nombre: `${variant.talla}, ${variant.color}`,
        precio_unitario_venta: Number(variant.precio),
        stock_actual: stockDisponible
      },
      qty: cantidadSolicitada
    })
  }
  saveCart()
}

function updateCartItem(index, newQty) {
  const item = cart.value[index]
  if (newQty <= 0) {
    removeFromCart(index)
    return
  }
  
  if (newQty > item.product.stock_actual) {
    alert(`Stock insuficiente. Disponible: ${item.product.stock_actual}`)
    return
  }
  
  item.qty = newQty
  saveCart()
}

function removeFromCart(index) {
  cart.value.splice(index, 1)
  saveCart()
}

function clearCart() {
  cart.value = []
  saveCart()
  localStorage.removeItem('modasoft_user')
  cliente.value = null
  cedulaBusqueda.value = ''
}

// Función para registrar venta
async function registrarVenta(ventaData) {
  try {
    const response = await axios.post('http://localhost:3000/api/ventas', ventaData)
    return response.data
  } catch (error) {
    console.error('Error en registrarVenta:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error.response) {
      throw new Error(`Error ${error.response.status}: ${error.response.statusText}`)
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor')
    } else {
      throw new Error('Error al configurar la petición')
    }
  }
}

async function facturar() {
  if (!cart.value.length) {
    alert('El carrito está vacío.')
    return
  }

  if (!metodoPagoSeleccionado.value) {
    alert('Por favor seleccione un método de pago.')
    return
  }

  // Validar stock antes de proceder
  for (const item of cart.value) {
    if (item.qty > item.product.stock_actual) {
      alert(`Stock insuficiente para ${item.product.nombre}. Disponible: ${item.product.stock_actual}`)
      return
    }
  }

  processing.value = true

  try {
    // Preparar datos para la venta según tu API
    const payload = {
      cedula_cliente: cliente.value?.cedula || '23948576', // Cliente general por defecto
      total: total.value,
      estado: 'pagada',
      id_usuario: idUsuario.value,
      detalles: cart.value.map(item => ({
        id_variante: item.product.id_variante,
        id_metodo: metodoPagoSeleccionado.value,
        cantidad: item.qty,
        precio_unitario_venta: item.product.precio_unitario_venta
      }))
    }

    console.log('Enviando venta:', payload)
    
    const resultado = await registrarVenta(payload)
    
    alert(`Factura registrada correctamente. ID de venta: ${resultado.id_venta}`)
    
    // Limpiar después de facturar
    clearCart()
    metodoPagoSeleccionado.value = ''
    
    // Recargar productos para actualizar stock
    await loadProducts()
    
  } catch (err) {
    console.error('Error al facturar:', err)
    alert(`Error: ${err.message}`)
  } finally {
    processing.value = false
  }
}

async function buscarCliente() {
  const ced = (cedulaBusqueda.value || '').trim()
  if (!ced) {
    alert('Por favor ingrese una cédula')
    return
  }

  buscandoCliente.value = true
  try {
    const res = await obtenerClientePorCedula(ced)
    cliente.value = res
    localStorage.setItem('modasoft_user', JSON.stringify(res))
  } catch (err) {
    cliente.value = null
    localStorage.removeItem('modasoft_user')
    alert('Cliente no encontrado o está inactivo')
  } finally {
    buscandoCliente.value = false
  }
}

async function cargarMetodosPago() {
  try {
    cargandoMetodosPago.value = true
    const response = await axios.get('http://localhost:3000/api/metodos-pago')
    metodosPago.value = response.data
    
    if (metodosPago.value.length > 0) {
      metodoPagoSeleccionado.value = metodosPago.value[0].id_metodo_pago
    }
  } catch (error) {
    console.error('Error cargando métodos de pago:', error)
    metodosPago.value = []
    // Opcional: Crear método de pago por defecto si la API falla
    metodoPagoSeleccionado.value = 1
  } finally {
    cargandoMetodosPago.value = false
  }
}

async function loadProducts() {
  loadingProducts.value = true
  errorProducts.value = false
  try {
    const data = await obtenerTodoElInventario()
    products.value = Array.isArray(data) ? data : []
    
    // Actualizar stock en el carrito si los productos ya están cargados
    cart.value.forEach(item => {
      const productoActual = products.value.find(p => 
        p.variantes?.some(v => v.id_variante === item.product.id_variante)
      )
      if (productoActual) {
        const variante = productoActual.variantes.find(v => v.id_variante === item.product.id_variante)
        if (variante) {
          item.product.stock_actual = variante.stock_actual || 0
        }
      }
    })
    
  } catch (err) {
    console.error('Error cargando inventario', err)
    errorProducts.value = true
  } finally {
    loadingProducts.value = false
  }
}

// Cargar datos al montar el componente
onMounted(async () => {
    await loadProducts()
    await cargarMetodosPago()

  
  // Cargar cliente desde localStorage si existe
  const clienteGuardado = localStorage.getItem('modasoft_user')
  if (clienteGuardado) {
    try {
      cliente.value = JSON.parse(clienteGuardado)
      cedulaBusqueda.value = cliente.value.cedula || ''
    } catch (e) {
      console.error('Error parseando cliente:', e)
    }
  }
})
</script>

<template>
    <Header />
  <div class="container py-4">
    <header class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">
            <i class="bi bi-bag-check me-2"></i>
            Módulo de Facturación
      </h2>
      <div class="text-muted small">Usuario ID: {{ idUsuario }}</div>
    </header>

    <div class="row">
      <!-- Columna de Productos -->
      <div class="col-md-8">
        <!-- Card de Cliente -->
        <div class="card mb-4 shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">Cliente</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-8">
                <input 
                  v-model="cedulaBusqueda" 
                  type="text" 
                  class="form-control" 
                  placeholder="Ingrese cédula del cliente" 
                  @keyup.enter="buscarCliente"
                />
              </div>
              <div class="col-md-4">
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-primary flex-grow-1" 
                    @click="buscarCliente" 
                    :disabled="buscandoCliente"
                  >
                    <span v-if="buscandoCliente" class="spinner-border spinner-border-sm me-1"></span>
                    {{ buscandoCliente ? 'Buscando...' : 'Buscar Cliente' }}
                  </button>
                  <button 
                    class="btn btn-outline-secondary" 
                    @click="() => { cliente = null; cedulaBusqueda = ''; localStorage.removeItem('modasoft_user') }"
                    :disabled="buscandoCliente"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="cliente" class="mt-3 p-3 bg-success bg-opacity-10 border border-success rounded">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="mb-1 text-success">
                    <i class="bi bi-person-check me-2"></i>
                    {{ cliente.nombre }}
                  </h6>
                  <div class="small">
                    <div><strong>Cédula:</strong> {{ cliente.cedula }}</div>
                    <div><strong>Teléfono:</strong> {{ cliente.telefono }}</div>
                    <div><strong>Email:</strong> {{ cliente.email }}</div>
                  </div>
                </div>
                <span class="badge bg-success">Cliente registrado</span>
              </div>
            </div>
            <div v-else class="mt-3 p-3 bg-info bg-opacity-10 border border-info rounded">
              <div class="text-center">
                <i class="bi bi-person fs-4 text-info"></i>
                <p class="mb-0 mt-2">Venta a cliente general</p>
                <small class="text-muted">Cédula: 23948576</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Card de Productos -->
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">Productos Disponibles</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  v-model="busquedaProducto" 
                  type="search" 
                  class="form-control" 
                  placeholder="Buscar productos por nombre..." 
                />
              </div>
            </div>

            <div v-if="errorProducts" class="alert alert-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>
              No se pudo cargar el inventario. Verifique la conexión.
            </div>
            
            <div v-else-if="loadingProducts" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-3 text-muted">Cargando catálogo de productos...</p>
            </div>
            
            <div v-else-if="productosFiltrados.length === 0" class="text-center py-5">
              <i class="bi bi-inbox fs-1 text-muted"></i>
              <p class="mt-3 text-muted">No se encontraron productos</p>
            </div>
            
            <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              <div v-for="p in productosFiltrados" :key="p.id_producto">
                <ProductCard 
                  :product="p" 
                  @add="addToCart"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna de Carrito -->
      <aside class="col-md-4">
        <div class="card shadow-sm sticky-top" style="top: 20px;">
          <div class="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-cart3 me-2"></i>
              Carrito de Compras
            </h5>
            <span class="badge bg-primary rounded-pill">{{ cart.length }}</span>
          </div>
          <div class="card-body">
            <!-- Método de Pago -->
            <div class="mb-4">
              <label class="form-label fw-bold">
                <i class="bi bi-credit-card me-1"></i>
                Método de Pago
              </label>
              <select 
                v-model="metodoPagoSeleccionado" 
                class="form-select"
                :disabled="cargandoMetodosPago || !cart.length"
                :class="{ 'is-invalid': !metodoPagoSeleccionado && cart.length > 0 }"
              >
                <option value="">Seleccione método de pago</option>
                <option 
                  v-for="metodo in metodosPago" 
                  :key="metodo.id_metodo_pago" 
                  :value="metodo.id_metodo_pago"
                >
                  {{ metodo.nombre }}
                </option>
              </select>
              <div v-if="cargandoMetodosPago" class="form-text text-muted">
                <small>Cargando métodos de pago...</small>
              </div>
              <div v-else-if="metodosPago.length === 0" class="form-text text-warning">
                <small>No se pudieron cargar los métodos de pago</small>
              </div>
            </div>

            <!-- Items del carrito -->
            <div v-if="cart.length">
              <div class="table-responsive mb-3">
                <table class="table table-sm table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Producto</th>
                      <th class="text-center">Cant.</th>
                      <th class="text-end">Subtotal</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in cart" :key="idx">
                      <td>
                        <div class="fw-semibold small">{{ item.product.nombre }}</div>
                        <div class="text-muted extra-small">{{ item.product.variante_nombre }}</div>
                        <div class="text-success small">${{ item.product.precio_unitario_venta.toFixed(2) }} c/u</div>
                        <div class="extra-small text-muted">Stock: {{ item.product.stock_actual }}</div>
                      </td>
                      <td class="text-center">
                        <div class="d-flex align-items-center justify-content-center">
                          <button 
                            class="btn btn-sm btn-outline-secondary py-0 px-2"
                            @click="updateCartItem(idx, item.qty - 1)"
                            :disabled="item.qty <= 1"
                          >
                            -
                          </button>
                          <span class="mx-2">{{ item.qty }}</span>
                          <button 
                            class="btn btn-sm btn-outline-secondary py-0 px-2"
                            @click="updateCartItem(idx, item.qty + 1)"
                            :disabled="item.qty >= item.product.stock_actual"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td class="text-end fw-bold">
                        ${{ (item.product.precio_unitario_venta * item.qty).toFixed(2) }}
                      </td>
                      <td class="text-center">
                        <button 
                          class="btn btn-sm btn-outline-danger" 
                          @click="removeFromCart(idx)"
                          title="Eliminar"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Total -->
              <div class="border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong class="fs-5">Total</strong>
                    <div class="text-muted small">{{ cart.length }} producto(s)</div>
                  </div>
                  <div class="text-end">
                    <div class="fs-4 fw-bold text-success">${{ total.toFixed(2) }}</div>
                    <div class="text-muted small">IVA incluido</div>
                  </div>
                </div>
                
                <!-- Botones de acción -->
                <div class="d-grid gap-2">
                  <button 
                    class="btn btn-success btn-lg" 
                    @click="facturar" 
                    :disabled="processing || !metodoPagoSeleccionado"
                  >
                    <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-receipt me-2"></i>
                    {{ processing ? 'Procesando Factura...' : 'FACTURAR' }}
                  </button>
                  
                  <button 
                    class="btn btn-outline-danger" 
                    @click="clearCart"
                    :disabled="processing"
                  >
                    <i class="bi bi-trash me-2"></i>
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Carrito vacío -->
            <div v-else class="text-center py-5">
              <div class="mb-3">
                <i class="bi bi-cart-x fs-1 text-muted"></i>
              </div>
              <h6 class="text-muted">Carrito vacío</h6>
              <p class="small text-muted">Agrega productos desde el catálogo</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
    <Footer />
</template>

<style scoped>
.container { 
  max-width: 1400px; 
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.table td {
  vertical-align: middle;
}

.extra-small {
  font-size: 0.75rem;
}

.sticky-top {
  z-index: 1020;
}

.btn-success {
  background: linear-gradient(135deg, #198754, #157347);
  border: none;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background: linear-gradient(135deg, #157347, #146c43);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(25, 135, 84, 0.2);
}

.btn-success:disabled {
  background: #6c757d;
  transform: none;
  box-shadow: none;
}

.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.05);
}
</style>