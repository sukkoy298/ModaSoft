<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: Object // Ahora recibe el producto completo con su array de variantes
})

const emit = defineEmits(['add'])

const selectedVariantId = ref(null)
const qty = ref(1)

// Encuentra el objeto de la variante seleccionada basado en su ID
const selectedVariant = computed(() => {
  if (!selectedVariantId.value) return null
  return props.product.variantes.find(v => v.id === selectedVariantId.value)
})

// Imagen a mostrar: la del producto o un placeholder si no tiene
const imageUrl = computed(() => {
  return props.product.imagen_url || 'https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSnjbk9TFNYzC0mOfLwVHXvsYh1qFFx-6JPImZZ2lakxPPnzuC8hOsdnHYLR7Bq0DLH1Pwb9vzs2wHBxW0a6NIRwicWhjdp6j04MwMGLazIX3VN7x8r6W-LRuMhEi1LfidpcKJghSgjhWy4WzAm4uh1vSxp7He7OUTzvW8TQy7hJMMmFbT4PbkGL_bFaCN4jS8I_hP4cw7orM-g18l8u00ZyjC0wmyy4Lmnj-70zpLIX91mJCLaON5dVwbmZhJkBmHIjFZUIYW0D0V84VXZxfW2WfYcoF7jDuJgkqpTk4PPXTQ7dJu6fx4SKaLyNNKFyzY1UO_yrWWszC08oSZUh47IRYz8zD4wZq8VPXs2vQy76W5FIza81GwFrebdbxuYXDlMbYWVmO1-3A_D2dW5zcd_R4-BlOsKVN0pXpTLnyAyc5mjKSI_Jy2EgnxAw7uDPtLlWqXnQaWZ0IV96vC7MZ6cT-v_ot_hfqiPZMzjlMHuUbTu9wEXjTtL8l4NUbVHIavgI4fw6CvfAoSMepKWzJJBevHdv0qql1pilnwE6exGNehvELH7x_M5qV7D-jsLIr2S5Tl2bQvqt5_qrLz4OR5oxyRDE_8zvEEqISS4VMCiirgciJyGxf4ag-ls3N0172AuPoHGSN8iZ5wlB-dK2FF0fGcAndE_asilZ9-4aBVMRDdRkUeCzelAYgLeKUI8nNFlXkXeW3BczNDUgmPC0jFNjUAFqaMA7fgu5dIvdq9sAWQfE8ZY4Azq2O8zcMWbJR_MWgtx9Gs0NLFlTanKVEGdbAM00Tbh9eiuNqc222jKzN5Ie12OF8wAOfxK1DzOiyeeytG-nRdb9DYbgnNTld0UBdwldq5FUDHcVkuFlFkvZOXyfHkV76wehKqafhYZhOHY68hthRcyhnGa2N8nc8LwUFY5PUnk3EHebi8TGm6_VDewFode3Agb9ydn5eHMu6i9wHLxnQOOXMlBXdGVhYvRwHlCQh5Ojmn9biY3gdRxNHp-y6XvdxwN8lCjHDU55OK8UfDcQ9czEvfeIGGrg2Dgw1MFl_dFwQpiAmqmhumJM3T3wuek091gAKql0eLDBqt4S6PHpu0wl1lUZmIlF3Sxa04DylVGAcSUbvbb-0tkX5Sj5IIstCzqQX7-ofQdhps1BhqjEiIizNVLMr-201cidqLlXTFRCtFYO8FJADl3_0W00v3StQbAy8o1F-DOcIJP0Zbjg=s1024-rj'
})

function add() {
  if (!selectedVariant.value) {
    alert('Por favor, seleccione una variante.')
    return
  }
  // Emitimos un objeto más completo para el carrito
  emit('add', {
    variant: selectedVariant.value,
    qty: Number(qty.value),
    productName: props.product.nombre
  })
  // Reseteamos la selección para la próxima vez
  selectedVariantId.value = null
  qty.value = 1
}
</script>

<template>
  <div class="card h-100">
    <img :src="imageUrl" class="card-img-top" alt="Imagen del producto" style="height: 180px; object-fit: cover;">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ product.nombre }}</h5>
      <p class="card-text text-muted small">{{ product.descripcion }}</p>

      <div class="mt-auto">
        <div class="mb-2">
          <select class="form-select" v-model="selectedVariantId">
            <option :value="null" disabled>Seleccione una variante...</option>
            <option v-for="variant in product.variantes" :key="variant.id" :value="variant.id" :disabled="variant.stock <= 0">
              {{ variant.talla }} - {{ variant.color }} (Stock: {{ variant.stock }})
            </option>
          </select>
        </div>

        <div v-if="selectedVariant" class="d-flex justify-content-between align-items-center mb-2">
          <span class="h5 mb-0">${{ Number(selectedVariant.precio).toFixed(2) }}</span>
          <input type="number" class="form-control" v-model="qty" min="1" :max="selectedVariant.stock" style="width: 70px;">
        </div>

        <button class="btn btn-primary w-100" @click="add" :disabled="!selectedVariant || selectedVariant.stock <= 0 || qty <= 0">
          Añadir al carrito
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Opcional: pequeño ajuste visual */
.card-title { font-size: 1rem; }
</style>