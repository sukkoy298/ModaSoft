<script setup>
import { ref, computed } from 'vue'
import products from '../data/products.js'
import ProductCard from '../components/ProductCard.vue'
import UserGate from '../components/UserGate.vue'

const cart = ref(JSON.parse(localStorage.getItem('modasoft_cart') || '[]'))

function addToCart(payload) {
  const { product, qty } = payload
  const existing = cart.value.find(i => i.product.id === product.id)
  if (existing) {
    existing.qty = Number(existing.qty) + Number(qty)
  } else {
    cart.value.push({ product, qty: Number(qty) })
  }
  localStorage.setItem('modasoft_cart', JSON.stringify(cart.value))
}

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.product.price * item.qty, 0)
})

// Nuevo: estado de búsqueda y lista filtrada
const search = ref('')

const filteredProducts = computed(() => {
  const q = (search.value || '').trim().toLowerCase()
  if (!q) return products
  return products.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.id || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q)
  )
})

function clearSearch() {
  search.value = ''
}

function facturar() {
  if (!cart.value.length) {
    alert('El carrito está vacío.')
    return
  }
  
  const currentUser = JSON.parse(localStorage.getItem('modasoft_user') || 'null')
  const fecha = new Date().toLocaleDateString('es-ES')
  
  const factura = {
    numero: 'F-' + Date.now(),
    fecha: fecha,
    cliente: currentUser || { nombre: 'Cliente General' },
    items: cart.value.map(item => ({
      producto: item.product.name,
      precio: item.product.price,
      cantidad: item.qty,
      subtotal: item.product.price * item.qty
    })),
    total: total.value
  }
  
  const facturaTexto = `
FACTURA - MODA SOFT
===================
Número: ${factura.numero}
Fecha: ${factura.fecha}
Cliente: ${factura.cliente.name || factura.cliente.nombre}
${factura.cliente.id ? `ID: ${factura.cliente.id}` : ''}

DETALLE:
${factura.items.map(item => 
  `${item.producto} - ${item.cantidad} x $${item.precio} = $${item.subtotal}`
).join('\n')}

TOTAL: $${factura.total}
===================
  `.trim()
  
  alert(facturaTexto)
  cart.value = []
  localStorage.removeItem('modasoft_cart')
}
</script>

<template>
  <div class="sales-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-inner">
        <img src="../assets/logo.jpg" alt="Moda Soft" class="app-logo" />
        <div class="header-titles">
          <h1 class="app-title">Moda Soft</h1>
          <p class="app-subtitle">Ventas</p>
        </div>
        <div class="header-actions">
          <!-- Espacio para acciones futuras (usuario, carrito, etc.) -->
        </div>
      </div>
    </header>

    <!-- Módulo de Usuario -->
    <section class="user-section">
      <UserGate />
    </section>

    <!-- Contenido Principal -->
    <div class="main-layout">
      <!-- Catálogo de Productos -->
      <section class="products-section">
        <div class="section-header">
          <h2>Productos</h2>

          <div class="catalog-controls">
            <form @submit.prevent>
              <input
                v-model="search"
                type="search"
                placeholder="Buscar por id, nombre o descripción..."
                class="search-input"
              />
              <button type="button" @click="clearSearch" class="btn-ghost">Limpiar</button>
            </form>
          </div>
        </div>

        <div class="products-grid">
          <ProductCard
            v-for="p in filteredProducts"
            :key="p.id"
            :product="p"
            @add="addToCart"
          />
        </div>
      </section>

      <!-- Carrito -->
      <aside class="cart-sidebar">
        <div class="cart-header">
          <h3>Carrito de Compras</h3>
          <div class="cart-badge">{{ cart.length }}</div>
        </div>

        <div class="cart-content">
          <div v-if="cart.length" class="cart-items">
            <div v-for="(item, index) in cart" :key="index" class="cart-item">
              <div class="item-info">
                <span class="item-name">{{ item.product.name }}</span>
                <span class="item-details">
                  ${{ item.product.price.toFixed(2) }} × {{ item.qty }}
                </span>
              </div>
              <span class="item-total">
                ${{ (item.product.price * item.qty).toFixed(2) }}
              </span>
            </div>
          </div>
          
          <div v-else class="empty-cart">
            <p>El carrito está vacío</p>
          </div>

          <div v-if="cart.length" class="cart-totals">
            <div class="total-line">
              <strong>Total: ${{ total.toFixed(2) }}</strong>
            </div>
          </div>

          <button 
            @click="facturar" 
            class="checkout-btn"
            :disabled="!cart.length"
          >
            Generar Factura
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* Header ajustado */
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
}
.app-logo {
  height: 64px;
  width: auto;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.header-titles {
  flex: 1;
  margin-left: 8px;
  text-align: left;
}
.app-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #222;
}
.app-subtitle {
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: #666;
}
.header-actions { display:flex; gap:8px; align-items:center; }

.sales-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.user-section {
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 20px;
}

.main-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  align-items: start;
}

.products-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.catalog-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.catalog-controls form {
  display:flex;
  gap:0.5rem;
  align-items:center;
}

.search-input {
  padding: 0.5rem;
  border:1px solid #e9ecef;
  border-radius:6px;
  min-width: 260px;
}

.btn-ghost {
  background:transparent;
  color:#0b84ff;
  border:1px solid #e6e6e6;
  padding:0.45rem 0.7rem;
  border-radius:6px;
  cursor:pointer;
}

.cart-summary {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cart-count {
  color: #666;
  font-size: 0.9rem;
}

.cart-total {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.cart-sidebar {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 2rem;
}

.cart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.cart-badge {
  background: #007bff;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.cart-content {
  padding: 1.5rem;
}

.cart-items {
  margin-bottom: 1.5rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 500;
  color: #333;
}

.item-details {
  font-size: 0.85rem;
  color: #666;
}

.item-total {
  font-weight: 600;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.cart-totals {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
  margin-bottom: 1.5rem;
}

.total-line {
  text-align: center;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  background: #218838;
}

.checkout-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .cart-sidebar {
    position: static;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .section-header {
    flex-direction: column;
    align-items: start;
    gap: 0.5rem;
  }
  
  .app-title {
    font-size: 2rem;
  }
}
</style>