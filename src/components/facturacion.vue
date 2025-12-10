<template>
    <Header />
    <div class="container moda-main-container mt-5 mb-5">
        <header class="moda-page-header mb-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h1 class="moda-title mb-1">
                        <i class="bi bi-bag-check moda-icon-danger me-2"></i>
                        Módulo de Facturación
                    </h1>
                    <p class="moda-subtitle">Venta rápida en caja</p>
                </div>
                <div class="moda-user-badge">
                    <i class="bi bi-person-circle me-2"></i>
                    Usuario ID: {{ idUsuario }}
                </div>
            </div>
        </header>

        <div class="row g-4">
            <!-- Columna de Productos -->
            <div class="col-md-8">
                <!-- Card de Cliente -->
                <div class="moda-card mb-4">
                    <div class="moda-card-header">
                        <h6 class="moda-card-title mb-0">
                            <i class="bi bi-person me-2"></i> Cliente
                        </h6>
                    </div>
                    <div class="moda-card-body">
                        <div class="row g-3">
                            <div class="col-md-8">
                                <div class="moda-input-group">
                                    <span class="moda-input-group-text">
                                        <i class="bi bi-person-badge"></i>
                                    </span>
                                    <input 
                                        v-model="cedulaBusqueda" 
                                        type="text" 
                                        class="moda-input"
                                        placeholder="Ingrese cédula del cliente" 
                                        @keyup.enter="buscarCliente"
                                    />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="d-flex gap-2">
                                    <button 
                                        class="btn moda-btn-primary flex-grow-1" 
                                        @click="buscarCliente" 
                                        :disabled="buscandoCliente"
                                    >
                                        <span v-if="buscandoCliente" class="spinner-border spinner-border-sm me-1"></span>
                                        {{ buscandoCliente ? 'Buscando...' : 'Buscar Cliente' }}
                                    </button>
                                    <button 
                                        class="btn moda-btn-outline" 
                                        @click="limpiarCliente"
                                        :disabled="buscandoCliente"
                                    >
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="cliente" class="moda-client-found mt-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="moda-client-name mb-1">
                                        <i class="bi bi-person-check me-2"></i>
                                        {{ cliente.nombre }}
                                    </h6>
                                    <div class="moda-client-info">
                                        <div><strong>Cédula:</strong> {{ cliente.cedula }}</div>
                                        <div><strong>Teléfono:</strong> {{ cliente.telefono }}</div>
                                        <div><strong>Email:</strong> {{ cliente.email }}</div>
                                    </div>
                                </div>
                                <span class="moda-badge moda-badge-success">Cliente registrado</span>
                            </div>
                        </div>
                        
                        <!-- NUEVO: si no se encontró cliente, mostrar botones para registrar -->
                        <div v-else-if="clienteNoEncontrado" class="moda-client-default mt-3 p-3 text-center">
                            <i class="bi bi-exclamation-triangle moda-client-icon text-warning mb-2"></i>
                            <p class="mb-2">Cliente no encontrado con la cédula <strong>{{ cedulaBusqueda }}</strong>.</p>
                            <div class="d-grid gap-2 col-8 mx-auto">
                                <button class="btn moda-btn-primary" @click="irARegistroCliente">
                                    <i class="bi bi-person-plus-fill me-2"></i> Registrar Cliente
                                </button>
                                <button class="btn moda-btn-outline" @click="limpiarCliente">
                                    <i class="bi bi-x-lg me-2"></i> Cancelar búsqueda
                                </button>
                            </div>
                        </div>

                        <div v-else class="moda-client-default mt-3">
                            <div class="text-center">
                                <i class="bi bi-person moda-client-icon"></i>
                                <p class="mb-0 mt-2">Venta a cliente general</p>
                                <small class="moda-text-muted">Cédula: 23948576</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card de Productos -->
                <div class="moda-card">
                    <div class="moda-card-header">
                        <h6 class="moda-card-title mb-0">
                            <i class="bi bi-box-seam me-2"></i> Productos Disponibles
                        </h6>
                    </div>
                    <div class="moda-card-body">
                        <div class="mb-4">
                            <div class="moda-input-group">
                                <span class="moda-input-group-text">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input 
                                    v-model="busquedaProducto" 
                                    type="search" 
                                    class="moda-input"
                                    placeholder="Buscar productos por nombre..." 
                                />
                            </div>
                        </div>

                        <div v-if="errorProducts" class="moda-alert moda-alert-error">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            No se pudo cargar el inventario. Verifique la conexión.
                        </div>
                        
                        <div v-else-if="loadingProducts" class="moda-loading-state">
                            <div class="moda-spinner"></div>
                            <p class="mt-3 moda-subtitle">Cargando catálogo de productos...</p>
                        </div>
                        
                        <div v-else-if="productosFiltrados.length === 0" class="moda-empty-state">
                            <i class="bi bi-inbox moda-empty-icon"></i>
                            <p class="mt-3 moda-empty-title">No se encontraron productos</p>
                        </div>
                        
                        <div v-else class="row row-cols-1 row-cols-md-2 g-3">
                            <div v-for="p in productosFiltrados" :key="p.id_producto" class="col">
                                <div class="moda-product-card">
                                    <ProductCard 
                                        :product="p" 
                                        @add="addToCart"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Columna de Carrito -->
            <aside class="col-md-4">
                <div class="moda-card moda-cart-card">
                    <div class="moda-card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="moda-card-title mb-0">
                                <i class="bi bi-cart3 me-2"></i>
                                Carrito de Compras
                            </h6>
                            <span class="moda-badge moda-badge-primary">{{ cart.length }}</span>
                        </div>
                    </div>
                    <div class="moda-card-body">
                        <!-- Método de Pago -->
                        <div class="mb-4">
                            <label class="moda-label">
                                <i class="bi bi-credit-card me-1"></i>
                                Método de Pago
                            </label>
                            <select 
                                v-model="metodoPagoSeleccionado" 
                                class="moda-select"
                                :disabled="cargandoMetodosPago || !cart.length"
                                :class="{ 'moda-select-error': !metodoPagoSeleccionado && cart.length > 0 }"
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
                            <div v-if="cargandoMetodosPago" class="moda-input-help">
                                Cargando métodos de pago...
                            </div>
                            <div v-else-if="metodosPago.length === 0" class="moda-input-warning">
                                No se pudieron cargar los métodos de pago
                            </div>
                        </div>

                        <!-- Items del carrito -->
                        <div v-if="cart.length">
                            <div class="moda-table-container mb-3">
                                <table class="moda-table moda-table-sm">
                                    <thead>
                                        <tr>
                                            <th class="moda-table-th">Producto</th>
                                            <th class="moda-table-th text-center">Cant.</th>
                                            <th class="moda-table-th text-end">Subtotal</th>
                                            <th class="moda-table-th text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, idx) in cart" :key="idx"
                                            :class="'moda-row-' + (idx % 2 === 0 ? 'even' : 'odd')">
                                            <td class="moda-table-td">
                                                <div class="moda-cart-product">
                                                    <div class="moda-cart-product-name">{{ item.product.nombre }}</div>
                                                    <div class="moda-cart-product-variant">{{ item.product.variante_nombre }}</div>
                                                    <div class="moda-cart-product-price">${{ item.product.precio_unitario_venta.toFixed(2) }} c/u</div>
                                                    <div class="moda-cart-product-stock">Stock: {{ item.product.stock_actual }}</div>
                                                </div>
                                            </td>
                                            <td class="moda-table-td text-center">
                                                <div class="moda-quantity-control">
                                                    <button 
                                                        class="btn moda-quantity-btn"
                                                        @click="updateCartItem(idx, item.qty - 1)"
                                                        :disabled="item.qty <= 1"
                                                    >
                                                        -
                                                    </button>
                                                    <span class="moda-quantity-value">{{ item.qty }}</span>
                                                    <button 
                                                        class="btn moda-quantity-btn"
                                                        @click="updateCartItem(idx, item.qty + 1)"
                                                        :disabled="item.qty >= item.product.stock_actual"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td class="moda-table-td text-end moda-amount">
                                                ${{ (item.product.precio_unitario_venta * item.qty).toFixed(2) }}
                                            </td>
                                            <td class="moda-table-td text-center">
                                                <button 
                                                    class="btn moda-btn-sm moda-btn-outline-danger" 
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
                            <div class="moda-cart-total">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <strong class="moda-total-label">Total</strong>
                                        <div class="moda-total-items">{{ cart.length }} producto(s)</div>
                                    </div>
                                    <div class="text-end">
                                        <div class="moda-total-amount">${{ total.toFixed(2) }}</div>
                                        <div class="moda-tax-text">IVA incluido</div>
                                    </div>
                                </div>
                                
                                <!-- Botones de acción -->
                                <div class="moda-cart-actions">
                                    <button 
                                        class="btn moda-btn-primary moda-btn-lg w-100 mb-2" 
                                        @click="facturar" 
                                        :disabled="processing || !metodoPagoSeleccionado"
                                    >
                                        <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="bi bi-receipt me-2"></i>
                                        {{ processing ? 'Procesando Factura...' : 'FACTURAR' }}
                                    </button>
                                    
                                    <button 
                                        class="btn moda-btn-outline-danger w-100" 
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
                        <div v-else class="moda-empty-cart">
                            <div class="mb-3">
                                <i class="bi bi-cart-x moda-empty-cart-icon"></i>
                            </div>
                            <h6 class="moda-empty-cart-title">Carrito vacío</h6>
                            <p class="moda-empty-cart-text">Agrega productos desde el catálogo</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { obtenerClientePorCedula } from '@/cliente.js'
import { obtenerTodoElInventario } from '@/producto.js'
import Header from '@/components/Header.vue'; 
import Footer from '@/components/Footer.vue'; 
import axios from 'axios'
import { useRouter } from 'vue-router' // <-- agregado

const router = useRouter() // <-- agregado

// Estado del componente
const cliente = ref(null)
const cedulaBusqueda = ref('')
const buscandoCliente = ref(false)
const clienteNoEncontrado = ref(false) // <-- agregado

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

// Usuario
const idUsuario = ref(1)

// Estado de facturación
const processing = ref(false)

// Computed
const total = computed(() => cart.value.reduce((s, i) =>
  s + ((i.product.precio_unitario_venta ?? i.product.price ?? 0) * i.qty), 0))

const productosFiltrados = computed(() => {
  if (!busquedaProducto.value) {
    return products.value
  }
  const busqueda = busquedaProducto.value.toLowerCase()
  return products.value.filter(p =>
    p.nombre?.toLowerCase().includes(busqueda)
  )
})

// Funciones
function limpiarCliente() {
    cliente.value = null
    cedulaBusqueda.value = ''
    localStorage.removeItem('modasoft_user')
    clienteNoEncontrado.value = false // <-- asegurar limpiar estado
}

function saveCart() {
  localStorage.setItem('modasoft_cart', JSON.stringify(cart.value))
}

function addToCart({ variant, qty, productName }) {
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
  limpiarCliente()
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
    const payload = {
      cedula_cliente: cliente.value?.cedula || '23948576',
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
    
    clearCart()
    metodoPagoSeleccionado.value = ''
    
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
  clienteNoEncontrado.value = false // reset
  try {
    const res = await obtenerClientePorCedula(ced)
    cliente.value = res
    localStorage.setItem('modasoft_user', JSON.stringify(res))
  } catch (err) {
    cliente.value = null
    localStorage.removeItem('modasoft_user')
    // En vez de alert, activamos la vista de registro
    clienteNoEncontrado.value = true
  } finally {
    buscandoCliente.value = false
  }
}

// NUEVO: guarda la cédula y navega a registro
function irARegistroCliente() {
  if (!cedulaBusqueda.value) return
  localStorage.setItem('modasoft_cedula_para_registro', cedulaBusqueda.value)
  router.push('/registro')
}

async function cargarMetodosPago() {
  try {
    cargandoMetodosPago.value = true;
    const response = await axios.get('http://localhost:3000/api/metodos-pago');
    // response.data puede venir con different naming: id_metodopago, id_metodo_pago, id_metodo
    const raw = Array.isArray(response.data) ? response.data : [];
    console.log('metodos-pago raw:', raw);

    // Normalizar campos a { id_metodo_pago, nombre }
    metodosPago.value = raw.map(m => {
      return {
        id_metodo_pago: m.id_metodo_pago ?? m.id_metodopago ?? m.id ?? null,
        nombre: m.nombre ?? m.nombre_metodo ?? m.descripcion ?? 'Método'
      };
    }).filter(m => m.id_metodo_pago !== null);

    console.log('metodos-pago normalizados:', metodosPago.value);

    if (metodosPago.value.length > 0) {
      metodoPagoSeleccionado.value = metodosPago.value[0].id_metodo_pago;
      console.log('metodoPagoSeleccionado set to', metodoPagoSeleccionado.value);
    } else {
      metodoPagoSeleccionado.value = '';
    }
  } catch (error) {
    console.error('Error cargando métodos de pago:', error);
    metodosPago.value = [];
    metodoPagoSeleccionado.value = '';
  } finally {
    cargandoMetodosPago.value = false;
  }
}

async function loadProducts() {
  loadingProducts.value = true
  errorProducts.value = false
  try {
    const data = await obtenerTodoElInventario()
    products.value = Array.isArray(data) ? data : []
    
    // Actualizar stock en el carrito
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

    // Cargar cliente desde localStorage
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

/* Encabezado de página */
.moda-page-header {
    padding-bottom: 1rem;
    border-bottom: 2px solid #D6CFC8;
}

.moda-title {
    color: #3A2E2A;
    font-weight: 700;
    font-size: 1.8rem;
    margin-bottom: 0.25rem;
}

.moda-icon-danger {
    color: #dc3545;
}

.moda-subtitle {
    color: #8B7355;
    font-weight: 500;
    font-size: 1rem;
}

.moda-user-badge {
    background-color: rgba(139, 115, 85, 0.1);
    color: #8B7355;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
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

.moda-cart-card {
    position: sticky;
    top: 20px;
}

.moda-card-header {
    background-color: #FFFDFB;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #D6CFC8;
    border-radius: 12px 12px 0 0;
}

.moda-card-title {
    color: #3A2E2A;
    font-weight: 600;
    font-size: 1rem;
}

.moda-card-body {
    padding: 1.5rem;
}

/* Inputs */
.moda-input-group {
    display: flex;
    border: 2px solid #D6CFC8;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.moda-input-group:focus-within {
    border-color: #4A3B34;
    box-shadow: 0 0 0 3px rgba(74, 59, 52, 0.2);
}

.moda-input-group-text {
    background-color: #FFFDFB;
    border: none;
    padding: 0.5rem 1rem;
    color: #8B7355;
    display: flex;
    align-items: center;
}

.moda-input {
    flex: 1;
    border: none;
    padding: 0.5rem 1rem;
    background-color: white;
    color: #3A2E2A;
    font-size: 1rem;
}

.moda-input:focus {
    outline: none;
}

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

.moda-select:focus {
    border-color: #4A3B34;
    box-shadow: 0 0 0 3px rgba(74, 59, 52, 0.2);
    outline: none;
}

.moda-select-error {
    border-color: #dc3545;
}

.moda-input-help {
    color: #8B7355;
    font-size: 0.8rem;
    margin-top: 0.25rem;
}

.moda-input-warning {
    color: #ffc107;
    font-size: 0.8rem;
    margin-top: 0.25rem;
}

.moda-label {
    color: #3A2E2A;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    display: block;
}

/* Botones */
.btn {
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    border: 2px solid;
}

.moda-btn-primary {
    background-color: #4A3B34;
    border-color: #4A3B34;
    color: white;
}

.moda-btn-primary:hover:not(:disabled) {
    background-color: #352822;
    border-color: #352822;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 59, 52, 0.3);
}

.moda-btn-outline {
    background-color: transparent;
    border: 2px solid #4A3B34;
    color: #4A3B34;
}

.moda-btn-outline:hover:not(:disabled) {
    background-color: #4A3B34;
    color: white;
    transform: translateY(-2px);
}

.moda-btn-outline-danger {
    background-color: transparent;
    border: 2px solid #dc3545;
    color: #dc3545;
}

.moda-btn-outline-danger:hover:not(:disabled) {
    background-color: #dc3545;
    color: white;
    transform: translateY(-2px);
}

.moda-btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
}

.moda-btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}

/* Información del cliente */
.moda-client-found {
    background-color: rgba(25, 135, 84, 0.1);
    border: 1px solid #198754;
    border-radius: 8px;
    padding: 1rem;
}

.moda-client-name {
    color: #198754;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.moda-client-info {
    color: #3A2E2A;
    font-size: 0.9rem;
    line-height: 1.4;
}

.moda-client-default {
    background-color: rgba(139, 115, 85, 0.1);
    border: 1px solid #8B7355;
    border-radius: 8px;
    padding: 1rem;
}

.moda-client-icon {
    font-size: 2rem;
    color: #8B7355;
}

.moda-text-muted {
    color: #8B7355;
    opacity: 0.8;
}

/* Badges */
.moda-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.moda-badge-primary {
    background-color: rgba(74, 59, 52, 0.15);
    color: #4A3B34;
}

.moda-badge-success {
    background-color: rgba(25, 135, 84, 0.15);
    color: #198754;
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
    padding: 2rem;
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

.moda-empty-state {
    text-align: center;
    padding: 2rem;
}

.moda-empty-icon {
    font-size: 3rem;
    color: #D6CFC8;
    margin-bottom: 1rem;
}

.moda-empty-title {
    color: #3A2E2A;
    font-weight: 500;
}

/* Tabla del carrito */
.moda-table-container {
    background-color: white;
    border-radius: 8px;
    border: 1px solid #D6CFC8;
    overflow: hidden;
}

.moda-table {
    width: 100%;
    border-collapse: collapse;
}

.moda-table-sm .moda-table-th,
.moda-table-sm .moda-table-td {
    padding: 0.5rem;
    font-size: 0.85rem;
}

.moda-table-th {
    background-color: #F8F5F2;
    color: #3A2E2A;
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    border-bottom: 1px solid #D6CFC8;
}

.moda-table-td {
    padding: 0.75rem 1rem;
    color: #3A2E2A;
    border-bottom: 1px solid #F8F5F2;
    vertical-align: middle;
}

.moda-row-even {
    background-color: white;
}

.moda-row-odd {
    background-color: #F8F5F2;
}

.moda-row-even:hover, .moda-row-odd:hover {
    background-color: rgba(139, 115, 85, 0.05);
}

/* Producto en carrito */
.moda-cart-product {
    display: flex;
    flex-direction: column;
}

.moda-cart-product-name {
    font-weight: 600;
    color: #3A2E2A;
    font-size: 0.9rem;
    margin-bottom: 0.1rem;
}

.moda-cart-product-variant {
    color: #8B7355;
    font-size: 0.8rem;
    margin-bottom: 0.1rem;
}

.moda-cart-product-price {
    color: #198754;
    font-size: 0.8rem;
    margin-bottom: 0.1rem;
}

.moda-cart-product-stock {
    color: #8B7355;
    font-size: 0.75rem;
}

/* Control de cantidad */
.moda-quantity-control {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.moda-quantity-btn {
    width: 28px;
    height: 28px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #D6CFC8;
    background-color: white;
    color: #3A2E2A;
    border-radius: 4px;
    font-weight: bold;
}

.moda-quantity-btn:hover:not(:disabled) {
    background-color: #F8F5F2;
    border-color: #8B7355;
}

.moda-quantity-value {
    min-width: 30px;
    text-align: center;
    font-weight: 600;
    color: #3A2E2A;
}

.moda-amount {
    font-weight: 600;
    color: #3A2E2A;
}

/* Total del carrito */
.moda-cart-total {
    border-top: 2px solid #D6CFC8;
    padding-top: 1rem;
}

.moda-total-label {
    color: #3A2E2A;
    font-size: 1.2rem;
    font-weight: 600;
}

.moda-total-items {
    color: #8B7355;
    font-size: 0.9rem;
}

.moda-total-amount {
    color: #198754;
    font-size: 1.5rem;
    font-weight: 700;
}

.moda-tax-text {
    color: #8B7355;
    font-size: 0.8rem;
}

/* Acciones del carrito */
.moda-cart-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* Carrito vacío */
.moda-empty-cart {
    text-align: center;
    padding: 2rem 1rem;
}

.moda-empty-cart-icon {
    font-size: 3rem;
    color: #D6CFC8;
    margin-bottom: 1rem;
}

.moda-empty-cart-title {
    color: #3A2E2A;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.moda-empty-cart-text {
    color: #8B7355;
    font-size: 0.9rem;
}

/* Tarjetas de productos */
.moda-product-card {
    height: 100%;
}

/* Responsive */
@media (max-width: 992px) {
    .moda-main-container {
        padding: 1.5rem;
    }
    
    .moda-cart-card {
        position: static;
    }
}

@media (max-width: 768px) {
    .moda-main-container {
        padding: 1rem;
        margin: 1rem auto;
    }
    
    .moda-title {
        font-size: 1.5rem;
    }
    
    .moda-card-body {
        padding: 1rem;
    }
    
    .row-cols-md-2 {
        grid-template-columns: 1fr !important;
    }
}

@media (max-width: 576px) {
    .row {
        margin: 0 -0.5rem;
    }
    
    .col-md-4, .col-md-8 {
        padding: 0.5rem;
    }
    
    .moda-table-container {
        overflow-x: auto;
    }
    
    .moda-table {
        min-width: 500px;
    }
}
</style>