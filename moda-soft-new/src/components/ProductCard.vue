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
.card { 
  color: #333; 
  border: 1px solid #eee; 
  padding: 0.8rem; 
  border-radius: 6px; 
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.thumb-container {
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 4px;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb { 
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.thumb:hover {
  transform: scale(1.05);
}

h4 {
  margin: 0.8rem 0 0.4rem 0;
  font-size: 1.1rem;
  min-height: 2.5rem;
}

.price { 
  color: #0b84ff; 
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0.4rem 0;
}

.desc {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  flex-grow: 1;
  margin: 0.4rem 0;
}

button { 
  margin-top: 0.6rem; 
  padding: 0.6rem 1rem;
  width: 100%;
  background: #0b84ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #0066cc;
}
</style>