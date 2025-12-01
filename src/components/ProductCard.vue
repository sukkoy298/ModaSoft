<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['add']);

// Estado local para la cantidad a agregar
const quantityToAdd = ref(1);
// Estado local para la variante seleccionada
const selectedVariantId = ref(null);

// Computed para la variante seleccionada
const selectedVariant = computed(() => {
  if (props.product.variantes && props.product.variantes.length > 0) {
    // Si no hay una variante seleccionada, selecciona la primera por defecto
    if (!selectedVariantId.value) {
      selectedVariantId.value = props.product.variantes[0].id_variante;
    }
    return props.product.variantes.find(v => v.id_variante === selectedVariantId.value);
  }
  return null;
});

// Computed para el stock de la variante seleccionada
const currentStock = computed(() => {
  if (!selectedVariant.value) return 0;
  
  // Asegurarnos de que stock_actual sea un número
  const stock = selectedVariant.value.stock_actual;
  return typeof stock === 'number' ? stock : parseInt(stock) || 0;
});

// Computed para el precio de la variante seleccionada
const currentPrice = computed(() => {
  if (!selectedVariant.value) return 0;
  
  // <-- CORREGIDO: Usar precio_unitario_venta directamente
  const price = selectedVariant.value.precio_unitario_venta; 
  return typeof price === 'number' ? price : parseFloat(price) || 0;
});

// Función para agregar al carrito
const handleAddToCart = () => {
  if (!selectedVariant.value) {
    alert('Por favor, seleccione una variante.');
    return;
  }
  
  const quantity = parseInt(quantityToAdd.value);
  const stock = currentStock.value;
  
  if (isNaN(quantity) || quantity <= 0) {
    alert('La cantidad debe ser un número mayor a 0.');
    return;
  }
  
  if (quantity > stock) {
    alert(`Stock insuficiente. Disponible: ${stock}`);
    return;
  }

  // Emitir evento con los datos estructurados correctamente
  emit('add', {
    variant: {
      id_variante: selectedVariant.value.id_variante,
      sku: selectedVariant.value.sku || '',
      talla: selectedVariant.value.talla || '',
      color: selectedVariant.value.color || '',
      precio: currentPrice.value, // <-- Usar currentPrice que ya es precio_unitario_venta
      stock_actual: stock
    },
    qty: quantity,
    productName: props.product.nombre || 'Producto sin nombre'
  });
  
  // Resetear cantidad después de agregar
  quantityToAdd.value = 1;
};

// Ajustar cantidad si excede el stock cuando cambia la variante
watch(selectedVariant, (newVariant) => {
  if (newVariant) {
    const stock = currentStock.value;
    if (quantityToAdd.value > stock) {
      quantityToAdd.value = stock > 0 ? 1 : 0;
    }
  }
});

// Función para incrementar cantidad
const incrementQuantity = () => {
  const stock = currentStock.value;
  if (quantityToAdd.value < stock) {
    quantityToAdd.value++;
  }
};

// Función para decrementar cantidad
const decrementQuantity = () => {
  if (quantityToAdd.value > 1) {
    quantityToAdd.value--;
  }
};

// Determinar si el botón de agregar debe estar deshabilitado
const isAddButtonDisabled = computed(() => {
  return !selectedVariant.value || 
         currentStock.value === 0 || 
         quantityToAdd.value <= 0 || 
         quantityToAdd.value > currentStock.value ||
         isNaN(quantityToAdd.value);
});

</script>

<template>
  <div class="card h-100 shadow-sm product-card">
    <div class="card-header bg-light py-2">
      <h6 class="card-title mb-0 text-primary fw-bold">
        <i class="bi bi-tag me-1"></i>{{ product.nombre }}
      </h6>
    </div>
    
    <div class="card-body d-flex flex-column p-3">
      <!-- Información del producto -->
      <div class="mb-2">
        <small class="text-muted d-block">
          <i class="bi bi-grid-1x2 me-1"></i>{{ product.categoria || 'Sin categoría' }}
        </small>
        <small class="text-muted d-block">
          <i class="bi bi-award me-1"></i>{{ product.marca || 'Sin marca' }}
        </small>
      </div>

      <!-- Selector de variante -->
      <div class="mb-3">
        <label class="form-label small fw-semibold text-secondary mb-1">
          <i class="bi bi-option me-1"></i>Seleccionar variante:
        </label>
        <select 
          class="form-select form-select-sm" 
          v-model="selectedVariantId"
          :disabled="!product.variantes || product.variantes.length === 0"
          :class="{ 'is-invalid': !product.variantes || product.variantes.length === 0 }"
        >
          <option v-if="!product.variantes || product.variantes.length === 0" value="" disabled>
            Sin variantes disponibles
          </option>
          <option 
            v-for="variant in product.variantes" 
            :key="variant.id_variante" 
            :value="variant.id_variante"
            :disabled="variant.stock_actual <= 0"
          >
            {{ variant.talla || 'N/A' }} / {{ variant.color || 'N/A' }} 
            - Stock: {{ variant.stock_actual || 0 }}
          </option>
        </select>
      </div>

      <!-- Información de la variante seleccionada -->
      <div v-if="selectedVariant" class="mb-3">
        <!-- Precio y stock -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div class="text-success fw-bold fs-5">
              ${{ currentPrice.toFixed(2) }}
            </div>
            <small class="text-muted">Precio unitario</small>
          </div>
          <div class="text-end">
            <div :class="['badge', currentStock > 10 ? 'bg-success' : currentStock > 0 ? 'bg-warning text-dark' : 'bg-danger']">
              <i class="bi bi-box-seam me-1"></i>{{ currentStock }} unidades
            </div>
            <small class="d-block text-muted mt-1">Stock disponible</small>
          </div>
        </div>
        
        <!-- Selector de cantidad -->
        <div class="mb-3">
          <label class="form-label small fw-semibold text-secondary mb-1">
            <i class="bi bi-123 me-1"></i>Cantidad:
          </label>
          <div class="input-group input-group-sm">
            <button 
              class="btn btn-outline-secondary" 
              type="button" 
              @click="decrementQuantity"
              :disabled="currentStock === 0 || quantityToAdd <= 1"
            >
              <i class="bi bi-dash"></i>
            </button>
            
            <input 
              type="number" 
              class="form-control text-center" 
              v-model.number="quantityToAdd" 
              min="1" 
              :max="currentStock"
              :disabled="currentStock === 0"
              @change="(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 1) quantityToAdd = 1;
                else if (value > currentStock) quantityToAdd = currentStock;
                else quantityToAdd = value;
              }"
            />
            
            <button 
              class="btn btn-outline-secondary" 
              type="button" 
              @click="incrementQuantity"
              :disabled="currentStock === 0 || quantityToAdd >= currentStock"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
          
          <!-- Mensajes de validación -->
          <div class="mt-2">
            <small v-if="currentStock === 0" class="text-danger d-block">
              <i class="bi bi-exclamation-triangle me-1"></i>Producto agotado
            </small>
            <small v-else-if="quantityToAdd > currentStock" class="text-warning d-block">
              <i class="bi bi-exclamation-circle me-1"></i>Cantidad excede el stock disponible
            </small>
            <small v-else-if="currentStock <= 5" class="text-warning d-block">
              <i class="bi bi-exclamation-triangle me-1"></i>Últimas unidades disponibles
            </small>
          </div>
        </div>
        
        <!-- Botón de agregar al carrito -->
        <button 
          class="btn btn-primary w-100 d-flex align-items-center justify-content-center"
          @click="handleAddToCart" 
          :disabled="isAddButtonDisabled"
          :class="{ 'btn-success': !isAddButtonDisabled }"
        >
          <i class="bi bi-cart-plus me-2"></i>
          <span>Agregar al carrito</span>
          <span v-if="quantityToAdd > 1" class="ms-2 badge bg-white text-dark">
            {{ quantityToAdd }} unidades
          </span>
        </button>
        
        <!-- Subtotal -->
        <div class="text-center mt-2">
          <small class="text-muted">
            Subtotal: <strong>${{ (currentPrice * quantityToAdd).toFixed(2) }}</strong>
          </small>
        </div>
      </div>
      
      <!-- Mensaje si no hay variantes -->
      <div v-else class="alert alert-warning small py-2 mt-2">
        <i class="bi bi-exclamation-circle me-1"></i>
        No hay variantes disponibles para este producto.
      </div>
    </div>
    
    <!-- Footer de la tarjeta -->
    <div v-if="selectedVariant && selectedVariant.sku" class="card-footer bg-light py-2">
      <small class="text-muted d-flex justify-content-between">
        <span><i class="bi bi-upc-scan me-1"></i>SKU: {{ selectedVariant.sku }}</span>
        <span v-if="product.id_producto" class="text-muted">ID: {{ product.id_producto }}</span>
      </small>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.form-select-sm {
  font-size: 0.85rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
}

.form-select-sm:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.input-group-sm > .form-control,
.input-group-sm > .btn {
  height: calc(1.5em + 0.75rem + 2px);
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  border: none;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1c7430 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.badge {
  font-size: 0.75em;
  padding: 0.35em 0.65em;
  font-weight: 600;
}

.text-success {
  color: #198754 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

/* Estilos específicos para el input de cantidad */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
  height: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-card {
    margin-bottom: 1rem;
  }
  
  .card-title {
    font-size: 1rem;
  }
}
</style>