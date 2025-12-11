<template>
  <div class="modal fade" id="modalNuevoProducto" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Registrar Nuevo Producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarProducto">
            <!-- Sección Producto Principal -->
            <h6 class="border-bottom pb-2 mb-3">Datos Generales</h6>
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">Nombre del Producto *</label>
                <input type="text" class="form-control" v-model="form.nombre" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">Categoría *</label>
                <select class="form-select" v-model="form.id_categoria" required>
                  <option value="">Seleccionar...</option>
                  <option v-for="c in categorias" :key="c.id_categoria" :value="c.id_categoria">
                    {{ c.nombre }}
                  </option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Marca *</label>
                <select class="form-select" v-model="form.id_marca" required>
                  <option value="">Seleccionar...</option>
                  <option v-for="m in marcas" :key="m.id_marca" :value="m.id_marca">
                    {{ m.nombre }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" v-model="form.descripcion" rows="2"></textarea>
              </div>
            </div>

            <!-- Sección Variante Inicial -->
            <h6 class="border-bottom pb-2 mb-3">Datos de la Variante (Presentación)</h6>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Código (SKU) *</label>
                <input type="text" class="form-control" v-model="form.sku" required>
              </div>
              <div class="col-md-4">
                <label class="form-label">Talla *</label>
                <input type="text" class="form-control" v-model="form.talla" required placeholder="Ej: M, 40, Única">
              </div>
              <div class="col-md-4">
                <label class="form-label">Color *</label>
                <input type="text" class="form-control" v-model="form.color" required placeholder="Ej: Rojo, Azul">
              </div>
              <div class="col-md-6">
                <label class="form-label">Precio de Venta Sugerido *</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" class="form-control" v-model="form.precio_venta" step="0.01" min="0" required>
                </div>
              </div>
              <div class="col-md-6">
                 <!-- Stock inicial opcional, en compras suele ser 0 porque se va a comprar, 
                      pero lo dejamos por si acaso quieren inicializar -->
                <label class="form-label">Stock Inicial (Existencia actual)</label>
                <input type="number" class="form-control" v-model="form.stock_actual" min="0">
              </div>
            </div>

            <div class="mt-4 text-end">
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="procesando">
                <span v-if="procesando" class="spinner-border spinner-border-sm me-1"></span>
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import { Modal } from 'bootstrap'  <-- COMENTADO PARA EVITAR CONFLICTOS
import { 
  obtenerCategorias, 
  obtenerMarcas, 
  registrarProductoPrincipal, 
  registrarVariante 
} from '@/producto.js'

const emit = defineEmits(['productoCreado'])

const modalRef = ref(null)
const modalInstance = ref(null)

const categorias = ref([])
const marcas = ref([])
const procesando = ref(false)

const form = ref({
  nombre: '',
  id_categoria: '',
  id_marca: '',
  descripcion: '',
  sku: '',
  talla: '',
  color: '',
  precio_venta: 0,
  stock_actual: 0
})

const initModal = () => {
  // Usar la instancia global de Bootstrap para evitar conflictos con el Header
  if (window.bootstrap && window.bootstrap.Modal) {
    modalInstance.value = new window.bootstrap.Modal(modalRef.value)
  } else {
    // Fallback: intentar obtenerlo si no está explícito en window (aunque bundle lo suele poner)
    console.warn('Bootstrap global no detectado, los modales podrían fallar.')
  }
}

const abrir = async () => {
  form.value = {
    nombre: '',
    id_categoria: '',
    id_marca: '',
    descripcion: '',
    sku: '',
    talla: '',
    color: '',
    precio_venta: 0,
    stock_actual: 0
  }
  
  if (categorias.value.length === 0) await cargarDatos()
  
  modalInstance.value.show()
}

const cargarDatos = async () => {
  try {
    const [cats, marcs] = await Promise.all([
      obtenerCategorias(),
      obtenerMarcas()
    ])
    categorias.value = cats
    marcas.value = marcs
  } catch (error) {
    console.error('Error cargando cat/marcas:', error)
  }
}

const guardarProducto = async () => {
  procesando.value = true
  try {
    // 1. Crear producto principal
    const prodData = {
      nombre: form.value.nombre,
      id_categoria: form.value.id_categoria,
      id_marca: form.value.id_marca,
      descripcion: form.value.descripcion
    }
    const productoCreado = await registrarProductoPrincipal(prodData)

    // 2. Crear variante
    const varData = {
      id_producto: productoCreado.id_producto,
      sku: form.value.sku,
      talla: form.value.talla,
      color: form.value.color,
      precio_venta: form.value.precio_venta,
      stock_actual: form.value.stock_actual || 0
    }
    const varianteCreada = await registrarVariante(varData)

    // Notificar éxito y cerrar
    emit('productoCreado', {
      producto: productoCreado,
      variante: varianteCreada
    })
    
    modalInstance.value.hide()
    
  } catch (error) {
    console.error(error)
    alert('Error al guardar: ' + (error.response?.data?.message || error.message))
  } finally {
    procesando.value = false
  }
}

// Exponer método abrir
defineExpose({ abrir })

onMounted(() => {
  initModal()
})
</script>
