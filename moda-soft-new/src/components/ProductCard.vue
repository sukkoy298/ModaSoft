<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['add'])
const props = defineProps({ product: Object })

function add() {
  emit('add', props.product)
}
</script>

<template>
  <div class="card">
    <img :src="product.image" alt="" class="thumb" />
    <h4>{{ product.name }}</h4>
    <p class="price">${{ product.price }}</p>
    <p class="desc">{{ product.description }}</p>
    <button @click="add">Agregar</button>
  </div>
</template>

<style scoped>
.card { color: #333; border:1px solid #eee; padding:0.8rem; border-radius:6px; background:#fff;}
.thumb { width:100%; height:120px; object-fit:cover; border-radius:4px; background:#f4f4f4;}
.price { color:#0b84ff; font-weight:600; }
button { margin-top:0.6rem; padding:0.4rem 0.6rem; }
</style>