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
      precio: currentPrice.value,
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
  <div class="moda-product-card h-100">
    <div class="moda-product-header">
      <h6 class="moda-product-title">
        <i class="bi bi-tag me-1"></i>{{ product.nombre }}
      </h6>
    </div>
    
    <div class="moda-product-body">
      <!-- Información del producto -->
      <div class="moda-product-info mb-3">
        <small class="moda-product-category">
          <i class="bi bi-grid-1x2 me-1"></i>{{ product.categoria || 'Sin categoría' }}
        </small>
        <small class="moda-product-brand">
          <i class="bi bi-award me-1"></i>{{ product.marca || 'Sin marca' }}
        </small>
      </div>

      <!-- Selector de variante -->
      <div class="mb-3">
        <label class="moda-label mb-1">
          <i class="bi bi-option me-1"></i>Seleccionar variante:
        </label>
        <select 
          class="moda-select moda-select-sm" 
          v-model="selectedVariantId"
          :disabled="!product.variantes || product.variantes.length === 0"
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
      <div v-if="selectedVariant" class="moda-variant-info">
        <!-- Precio y stock -->
        <div class="moda-price-stock mb-3">
          <div class="moda-price-section">
            <div class="moda-price">
              ${{ currentPrice.toFixed(2) }}
            </div>
            <small class="moda-price-label">Precio unitario</small>
          </div>
          <div class="moda-stock-section">
            <div :class="['moda-stock-badge', currentStock > 10 ? 'moda-stock-high' : currentStock > 0 ? 'moda-stock-low' : 'moda-stock-out']">
              <i class="bi bi-box-seam me-1"></i>{{ currentStock }} unidades
            </div>
            <small class="moda-stock-label">Stock disponible</small>
          </div>
        </div>
        
        <!-- Selector de cantidad -->
        <div class="moda-quantity-selector mb-3">
          <label class="moda-label mb-1">
            <i class="bi bi-123 me-1"></i>Cantidad:
          </label>
          <div class="moda-quantity-control">
            <button 
              class="moda-quantity-btn" 
              type="button" 
              @click="decrementQuantity"
              :disabled="currentStock === 0 || quantityToAdd <= 1"
            >
              <i class="bi bi-dash"></i>
            </button>
            
            <input 
              type="number" 
              class="moda-quantity-input" 
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
              class="moda-quantity-btn" 
              type="button" 
              @click="incrementQuantity"
              :disabled="currentStock === 0 || quantityToAdd >= currentStock"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
          
          <!-- Mensajes de validación -->
          <div class="moda-validation-messages">
            <small v-if="currentStock === 0" class="moda-validation-error">
              <i class="bi bi-exclamation-triangle me-1"></i>Producto agotado
            </small>
            <small v-else-if="quantityToAdd > currentStock" class="moda-validation-warning">
              <i class="bi bi-exclamation-circle me-1"></i>Cantidad excede el stock disponible
            </small>
            <small v-else-if="currentStock <= 5" class="moda-validation-warning">
              <i class="bi bi-exclamation-triangle me-1"></i>Últimas unidades disponibles
            </small>
          </div>
        </div>
        
        <!-- Botón de agregar al carrito -->
        <button 
          class="moda-add-btn"
          @click="handleAddToCart" 
          :disabled="isAddButtonDisabled"
        >
          <i class="bi bi-cart-plus me-2"></i>
          <span>Agregar al carrito</span>
          <span v-if="quantityToAdd > 1" class="moda-quantity-badge">
            {{ quantityToAdd }} unidades
          </span>
        </button>
        
        <!-- Subtotal -->
        <div class="moda-subtotal">
          <small class="moda-subtotal-label">
            Subtotal: <strong>${{ (currentPrice * quantityToAdd).toFixed(2) }}</strong>
          </small>
        </div>
      </div>
      
      <!-- Mensaje si no hay variantes -->
      <div v-else class="moda-alert moda-alert-warning">
        <i class="bi bi-exclamation-circle me-1"></i>
        No hay variantes disponibles para este producto.
      </div>
    </div>
    
    <!-- Footer de la tarjeta -->
    <div v-if="selectedVariant && selectedVariant.sku" class="moda-product-footer">
      <small class="moda-product-footer-text">
        <span><i class="bi bi-upc-scan me-1"></i>SKU: {{ selectedVariant.sku }}</span>
        <span v-if="product.id_producto" class="moda-product-id">ID: {{ product.id_producto }}</span>
      </small>
    </div>
  </div>
</template>

<style scoped>
/* Tarjeta de producto Moda */
.moda-product-card {
  background-color: #FFFDFB;
  border: 1px solid #D6CFC8;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.moda-product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(74, 59, 52, 0.2);
  border-color: #8B7355;
}

/* Header de la tarjeta */
.moda-product-header {
  background: linear-gradient(135deg, #4A3B34, #5D4A3A);
  color: white;
  padding: 1rem;
  border-bottom: 1px solid #D6CFC8;
}

.moda-product-title {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0;
}

/* Cuerpo de la tarjeta */
.moda-product-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Información del producto */
.moda-product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.moda-product-category,
.moda-product-brand {
  color: #8B7355;
  font-size: 0.85rem;
}

/* Select de variante */
.moda-select {
  background-color: white;
  border: 2px solid #D6CFC8;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #3A2E2A;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
}

.moda-select-sm {
  font-size: 0.85rem;
  padding: 0.375rem 0.75rem;
}

.moda-select:focus {
  border-color: #4A3B34;
  box-shadow: 0 0 0 3px rgba(74, 59, 52, 0.2);
  outline: none;
}

.moda-select:disabled {
  background-color: #F8F5F2;
  opacity: 0.7;
  cursor: not-allowed;
}

/* Etiqueta */
.moda-label {
  color: #3A2E2A;
  font-weight: 600;
  font-size: 0.9rem;
  display: block;
}

/* Información de precio y stock */
.moda-price-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.moda-price-section {
  text-align: left;
}

.moda-stock-section {
  text-align: right;
}

.moda-price {
  color: #198754;
  font-size: 1.5rem;
  font-weight: 700;
}

.moda-price-label {
  color: #8B7355;
  font-size: 0.8rem;
}

.moda-stock-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.moda-stock-high {
  background-color: rgba(25, 135, 84, 0.15);
  color: #198754;
}

.moda-stock-low {
  background-color: rgba(255, 193, 7, 0.15);
  color: #ffc107;
}

.moda-stock-out {
  background-color: rgba(220, 53, 69, 0.15);
  color: #dc3545;
}

.moda-stock-label {
  color: #8B7355;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

/* Control de cantidad */
.moda-quantity-control {
  display: flex;
  border: 2px solid #D6CFC8;
  border-radius: 8px;
  overflow: hidden;
}

.moda-quantity-btn {
  background-color: #FFFDFB;
  border: none;
  color: #3A2E2A;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.moda-quantity-btn:hover:not(:disabled) {
  background-color: #F8F5F2;
}

.moda-quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.moda-quantity-input {
  flex: 1;
  border: none;
  text-align: center;
  font-weight: 600;
  color: #3A2E2A;
  background-color: white;
  font-size: 1rem;
}

.moda-quantity-input:focus {
  outline: none;
}

.moda-quantity-input:disabled {
  background-color: #F8F5F2;
}

/* Mensajes de validación */
.moda-validation-messages {
  margin-top: 0.5rem;
}

.moda-validation-error {
  color: #dc3545;
  font-size: 0.8rem;
  display: block;
}

.moda-validation-warning {
  color: #ffc107;
  font-size: 0.8rem;
  display: block;
}

/* Botón de agregar al carrito */
.moda-add-btn {
  background-color: #4A3B34;
  border: 2px solid #4A3B34;
  color: white;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;
  position: relative;
}

.moda-add-btn:hover:not(:disabled) {
  background-color: #352822;
  border-color: #352822;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 59, 52, 0.3);
}

.moda-add-btn:disabled {
  background-color: #D6CFC8;
  border-color: #D6CFC8;
  color: #8B7355;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.moda-quantity-badge {
  position: absolute;
  right: 0.75rem;
  background-color: white;
  color: #4A3B34;
  border-radius: 20px;
  padding: 0.1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Subtotal */
.moda-subtotal {
  text-align: center;
}

.moda-subtotal-label {
  color: #8B7355;
  font-size: 0.85rem;
}

.moda-subtotal-label strong {
  color: #198754;
}

/* Alerta */
.moda-alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid;
  font-size: 0.85rem;
  margin-top: 1rem;
}

.moda-alert-warning {
  background-color: rgba(255, 193, 7, 0.1);
  border-color: #ffc107;
  color: #ffc107;
}

/* Footer de la tarjeta */
.moda-product-footer {
  background-color: #F8F5F2;
  padding: 0.75rem 1rem;
  border-top: 1px solid #D6CFC8;
}

.moda-product-footer-text {
  color: #8B7355;
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
}

.moda-product-id {
  color: #3A2E2A;
  font-weight: 500;
}

/* Estilos específicos para el input de cantidad */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
  height: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .moda-product-card {
    margin-bottom: 1rem;
  }
  
  .moda-product-title {
    font-size: 0.9rem;
  }
  
  .moda-price {
    font-size: 1.25rem;
  }
  
  .moda-add-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .moda-product-body {
    padding: 1rem;
  }
  
  .moda-price-stock {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .moda-stock-section {
    text-align: left;
  }
}
</style>