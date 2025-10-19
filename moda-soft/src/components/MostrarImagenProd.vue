<template>
  <div>
    <button 
      type="button" 
      class="btn btn-outline-info btn-sm" 
      :data-bs-target="'#imgModal-' + productId" 
      data-bs-toggle="modal"
      :aria-controls="'imgModal-' + productId"
      aria-label="Ver imagen del producto"
    >
    <i class="bi bi-image"></i> </button>

    <div 
      class="modal fade" 
      :id="'imgModal-' + productId" 
      tabindex="-1" 
      :aria-labelledby="'imgModalLabel-' + productId" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :id="'imgModalLabel-' + productId">
              Visualización de Imagen
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <img 
              :src="imageUrl" 
              alt="Imagen del Producto ModaSoft" 
              class="img-fluid rounded shadow-sm"
              style="max-height: 75vh; object-fit: contain;"
            >
            <p v-if="!imageUrl" class="mt-3 text-danger">⚠️ URL de imagen no disponible.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineProps } from 'vue';

const props = defineProps({
  imageUrl:{
    type: String,
    required: true,
    default: "./src/assets/img_placeholder.jpg"
    
  },
  productId:{
    type: Number,
    required: true
  }
})
</script>