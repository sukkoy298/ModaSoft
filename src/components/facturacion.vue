<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { obtenerClientePorCedula } from '@/cliente.js'
import { obtenerTodoElInventario } from '@/producto.js'
import { registrarVenta } from '@/venta.js' // <-- Importa desde el nuevo archivo venta.js
import axios from 'axios'

// Cliente
const cliente = ref(JSON.parse(localStorage.getItem('modasoft_user') || 'null'))
const cedulaBusqueda = ref('')
const buscandoCliente = ref(false)

// Productos
const products = ref([])
const loadingProducts = ref(true)
const errorProducts = ref(false)
const busquedaProducto = ref('')

// Carrito
const cart = ref(JSON.parse(localStorage.getItem('modasoft_cart') || '[]'))

const total = computed(() => cart.value.reduce((s, i) => s + (i.product.price || 0) * i.qty, 0))

// Filtra productos según el término de búsqueda (ahora solo por nombre de producto)
const productosFiltrados = computed(() => {
  if (!busquedaProducto.value) {
    return products.value
  }
  const busqueda = busquedaProducto.value.toLowerCase()
  return products.value.filter(p =>
    p.nombre?.toLowerCase().includes(busqueda)
  )
})

function saveCart() {
  localStorage.setItem('modasoft_cart', JSON.stringify(cart.value))
}

// La función addToCart ahora recibe un objeto más complejo desde ProductCard
function addToCart({ variant, qty, productName }) {
  const existing = cart.value.find(i => i.product.id === variant.id)
  if (existing) {
    existing.qty = Number(existing.qty) + Number(qty)
  } else {
    cart.value.push({
      product: {
        id: variant.id,
        sku: variant.sku,
        name: `${productName} (${variant.talla}, ${variant.color})`,
        price: Number(variant.precio)
      },
      qty: Number(qty)
    })
  }
  saveCart()
}

function removeFromCart(index) {
  cart.value.splice(index, 1)
  saveCart()
}

function clearCart() {
  cart.value = []
  saveCart()
}

const processing = ref(false)

async function facturar() {
  if (!cart.value.length) {
    alert('El carrito está vacío.');
    return;
  }
  
  processing.value = true;
  try {
    // ✅ PREPARAR DATOS CON VALORES GARANTIZADOS
    const payload = {
      cliente: cliente.value ? {
        cedula: cliente.value.cedula, // ✅ Asegurar que tenemos cédula
        nombre: cliente.value.nombre
      } : { cedula: '23948576', nombre: 'Cliente General' }, // ✅ Cliente por defecto
      lines: cart.value.map(i => ({
        id_variante: i.product.id, // ✅ Esto debe ser el ID de variante, no SKU
        qty: i.qty || 1,
        price: i.product.price || 0
      })),
      total: total.value,
      fecha: new Date().toISOString()
    };

    console.log('📤 Enviando payload:', payload);
    
    await registrarVenta(payload);
    alert('✅ Factura registrada correctamente.');
    clearCart();
    
  } catch (err) {
    console.error('❌ Error al facturar:', err);
    alert('Error: ' + (err.response?.data?.message || err.message));
  } finally {
    processing.value = false;
  }
}

async function buscarCliente() {
  const ced = (cedulaBusqueda.value || '').trim()
  if (!ced) return
  buscandoCliente.value = true
  try {
    const res = await obtenerClientePorCedula(ced)
    cliente.value = res
    localStorage.setItem('modasoft_user', JSON.stringify(res))
  } catch (err) {
    cliente.value = null
    localStorage.removeItem('modasoft_user')
    alert('Cliente no encontrado.')
  } finally {
    buscandoCliente.value = false
  }
}

async function loadProducts() {
  loadingProducts.value = true
  errorProducts.value = false
  try {
    const data = await obtenerTodoElInventario()
    products.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Error cargando inventario', err)
    errorProducts.value = true
  } finally {
    loadingProducts.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="container py-4">
    <header class="d-flex align-items-center mb-4">
      <h1 class="h4 mb-0">Facturación - ModaSoft</h1>
    </header>

    <div class="row">
      <!-- Columna de Productos -->
      <div class="col-md-8">
        <!-- Card de Cliente -->
        <div class="card mb-3 p-3">
          <div class="d-flex mb-3 gap-3">
            <input v-model="cedulaBusqueda" type="text" class="form-control" placeholder="Buscar cédula del cliente..." />
            <button class="btn btn-outline-primary" @click="buscarCliente" :disabled="buscandoCliente">Buscar</button>
            <button class="btn btn-outline-secondary" @click="() => { cliente = null; localStorage.removeItem('modasoft_user') }">Limpiar</button>
          </div>
          <div v-if="cliente" class="alert alert-success"><strong>{{ cliente.nombre }}</strong> — {{ cliente.cedula }}</div>
          <div v-else class="alert alert-info">Venta a cliente general.</div>
        </div>

        <!-- Card de Productos -->
        <div class="card p-3">
          <h5 class="card-title mb-3">Productos Disponibles</h5>
          <div class="mb-3">
            <input v-model="busquedaProducto" type="text" class="form-control" placeholder="Buscar por nombre de producto..." />
          </div>

          <div v-if="errorProducts" class="text-danger">No se pudo cargar el inventario.</div>
          <div v-else-if="loadingProducts" class="text-center p-5">Cargando productos...</div>
          <div v-else-if="productosFiltrados.length === 0" class="text-center text-muted p-5">No se encontraron productos.</div>
          <div v-else class="row g-3">
            <div class="col-sm-6 col-lg-4" v-for="p in productosFiltrados" :key="p.id">
              <ProductCard :product="p" @add="addToCart" />
            </div>
          </div>
        </div>
      </div>

      <!-- Columna de Carrito -->
      <aside class="col-md-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Carrito</h5>
            <span class="badge bg-primary">{{ cart.length }}</span>
          </div>
          <div class="card-body">
            <div v-if="cart.length">
              <ul class="list-group mb-3">
                <li class="list-group-item d-flex justify-content-between align-items-start" v-for="(item, idx) in cart" :key="idx">
                  <div>
                    <div class="fw-bold">{{ item.product.name }}</div>
                    <small class="text-muted">{{ item.qty }} × ${{ item.product.price.toFixed(2) }}</small>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <div class="h6 mb-0">${{ (item.product.price * item.qty).toFixed(2) }}</div>
                    <button class="btn btn-sm btn-outline-danger" @click="removeFromCart(idx)"><i class="bi bi-trash"></i></button>
                  </div>
                </li>
              </ul>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <strong>Total</strong>
                <div class="h5 mb-0">${{ total.toFixed(2) }}</div>
              </div>
              <button class="btn btn-success w-100" @click="facturar" :disabled="processing">Facturar</button>
            </div>
            <div v-else class="text-center text-muted p-4">El carrito está vacío</div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 1200px; }
</style>