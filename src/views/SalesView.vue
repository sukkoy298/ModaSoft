<script setup>
import { ref, computed } from 'vue'
import products from '../data/products.js'
import ProductCard from '../components/ProductCard.vue'
import UserGate from '../components/UserGate.vue'

const cart = ref(JSON.parse(localStorage.getItem('modasoft_cart') || '[]'))

function addToCart(payload) {
  const { product, qty } = payload
  const existing = cart.value.find(i => i.product.id === product.id)
  if (existing) existing.qty = Number(existing.qty) + Number(qty)
  else cart.value.push({ product, qty: Number(qty) })
  localStorage.setItem('modasoft_cart', JSON.stringify(cart.value))
}

const total = computed(() => cart.value.reduce((s, i) => s + i.product.price * i.qty, 0))

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

function clearSearch() { search.value = '' }

function facturar() {
  if (!cart.value.length) { alert('El carrito está vacío.'); return }
  const currentUser = JSON.parse(localStorage.getItem('modasoft_user') || 'null')
  const fecha = new Date().toLocaleString()
  const lines = cart.value.map(i => `${i.product.name} x${i.qty} — $${(i.product.price * i.qty).toFixed(2)}`)
  const text = `Factura - Moda Soft\nFecha: ${fecha}\nCliente: ${currentUser?.name || 'General'}\n\n${lines.join('\n')}\n\nTotal: $${total.value.toFixed(2)}`
  alert(text)
  cart.value = []
  localStorage.removeItem('modasoft_cart')
}
</script>

<template>
  <div class="container py-4">
    <!-- Header -->
    <header class="d-flex align-items-center mb-4">
      <img src="../assets/logo.jpg" alt="Moda Soft" style="height:64px;border-radius:8px;" class="me-3">
      <div>
        <h1 class="h4 mb-0">Moda Soft</h1>
        <small class="text-muted">Punto de ventas</small>
      </div>
    </header>

    <UserGate />

    <div class="row mt-3">
      <!-- Catálogo -->
      <div class="col-md-8">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <input v-model="search" type="search" class="form-control me-2" placeholder="Buscar por id, nombre o descripción">
              <button class="btn btn-outline-secondary" @click="clearSearch">Limpiar</button>
              <div class="ms-auto text-muted">Items: {{ cart.length }} — <strong>${{ total.toFixed(2) }}</strong></div>
            </div>

            <div class="row g-3">
              <div class="col-sm-6 col-lg-4" v-for="p in filteredProducts" :key="p.id">
                <ProductCard :product="p" @add="addToCart" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carrito -->
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
                  <div class="ms-3">${{ (item.product.price * item.qty).toFixed(2) }}</div>
                </li>
              </ul>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <strong>Total</strong>
                <div class="h5 mb-0">${{ total.toFixed(2) }}</div>
              </div>
              <button class="btn btn-success w-100" @click="facturar">Facturar</button>
            </div>
            <div v-else class="text-center text-muted">
              El carrito está vacío
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* Se apoya en Bootstrap para la mayoría de estilos; aquí sólo ajustes menores */
</style>