<script setup>
import { ref } from 'vue'
import products from '../data/products.js'
import ProductCard from '../components/ProductCard.vue'
import UserGate from '../components/UserGate.vue'

const cart = ref([])

function addToCart(product) {
  cart.value.push(product)
  // guarda temporal en localStorage
  localStorage.setItem('modasoft_cart', JSON.stringify(cart.value))
}
</script>

<template>
  <section>
    <UserGate />
    <h2>Productos - Moda Soft</h2>
    <div class="grid">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        @add="addToCart"
      />
    </div>

    <aside class="cart">
      <h3>Carrito ({{ cart.length }})</h3>
      <ul>
        <li v-for="(c, i) in cart" :key="i">{{ c.name }} — ${{ c.price }}</li>
      </ul>
    </aside>
  </section>
</template>

<style scoped>
.grid {
  display:grid;
  grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
  gap:1rem;
  margin-top:1rem;
}
.cart {
  margin-top:1.5rem;
  border-top:1px solid #eee;
  padding-top:1rem;
}
</style>