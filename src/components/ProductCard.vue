<script setup>
import { ref } from 'vue'
const props = defineProps({ product: Object })
const emit = defineEmits(['add'])

const qty = ref(1)
function add() { emit('add', { product: props.product, qty: Number(qty.value) }) }
function increment() { qty.value = Math.max(1, qty.value + 1) }
function decrement() { qty.value = Math.max(1, qty.value - 1) }
</script>

<template>
  <div class="card h-100">
    <img :src="product.image" class="card-img-top" :alt="product.name" style="height:180px;object-fit:cover;">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ product.name }}</h5>
      <p class="card-text text-muted small mb-2">{{ product.description }}</p>
      <div class="mt-auto">
        <div class="d-flex align-items-center gap-2 mb-2">
          <div class="input-group input-group-sm" style="width:120px;">
            <button class="btn btn-outline-secondary" type="button" @click="decrement">-</button>
            <input class="form-control text-center" type="number" min="1" v-model.number="qty">
            <button class="btn btn-outline-secondary" type="button" @click="increment">+</button>
          </div>
          <div class="fw-bold ms-auto h5 mb-0">${{ product.price.toFixed(2) }}</div>
        </div>

        <button class="btn btn-primary btn-sm w-100" @click="add">
          Agregar (x{{ qty }})
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Opcional: pequeño ajuste visual */
.card-title { font-size: 1rem; }
</style>