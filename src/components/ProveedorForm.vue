<template>
  <Header />
  <div class="container moda-main-container mt-5">
    <h1 class="moda-title text-center mb-4">
      <i class="bi bi-person-plus-fill moda-icon-primary me-2"></i>
      {{ esEdicion ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor' }}
    </h1>
    
    <!-- Mensaje de resultado -->
    <div v-if="mensaje" :class="['moda-alert', esError ? 'moda-alert-error' : 'moda-alert-success']" role="alert">
      <i :class="['bi me-2', esError ? 'bi-exclamation-triangle' : 'bi-check-circle']"></i>
      {{ mensaje }}
    </div>
    
    <!-- Estado de carga -->
    <div v-else-if="cargando && esEdicion" class="moda-loading-state">
      <div class="moda-spinner"></div>
      <p class="mt-3 moda-subtitle">Cargando datos del proveedor...</p>
    </div>
    
    <!-- Formulario -->
    <form 
      class="moda-form"
      @submit.prevent="manejarSubmit"
      novalidate
      :class="{ 'was-validated': formularioEnviado }"
    >
      <div class="moda-form-grid">
        <!-- Documento de Identidad -->
        <div class="moda-form-group">
          <label for="doc_identidad" class="moda-label">
            <i class="bi bi-card-text me-1"></i> Documento de Identidad *
          </label>
          <input 
            type="text" 
            v-model="formulario.doc_identidad"
            required 
            maxlength="20" 
            minlength="5" 
            class="moda-input"
            placeholder="Ej: 123456789" 
            id="doc_identidad"
            :disabled="esEdicion">
          <div class="moda-feedback invalid-feedback">
            El documento de identidad es requerido.
          </div>
          <div v-if="esEdicion" class="moda-note">
            <i class="bi bi-info-circle me-1"></i> El documento no se puede modificar
          </div>
        </div>
        
        <!-- Nombre -->
        <div class="moda-form-group">
          <label for="nombre" class="moda-label">
            <i class="bi bi-person me-1"></i> Nombre *
          </label>
          <input 
            type="text" 
            v-model="formulario.nombre"
            required 
            maxlength="150" 
            minlength="3" 
            class="moda-input"
            placeholder="Nombre completo del proveedor" 
            id="nombre">
          <div class="moda-feedback invalid-feedback">
            El nombre es requerido (mínimo 3 caracteres).
          </div>
        </div>
        
        <!-- Teléfono -->
        <div class="moda-form-group">
          <label for="telefono" class="moda-label">
            <i class="bi bi-telephone me-1"></i> Teléfono
          </label>
          <input 
            type="tel" 
            v-model="formulario.telefono"
            maxlength="20" 
            class="moda-input"
            placeholder="Ej: +51 987654321" 
            id="telefono">
          <div class="moda-feedback">
            Campo opcional
          </div>
        </div>
        
        <!-- Email -->
        <div class="moda-form-group">
          <label for="email" class="moda-label">
            <i class="bi bi-envelope me-1"></i> Email
          </label>
          <input 
            type="email" 
            v-model="formulario.email"
            maxlength="100" 
            class="moda-input"
            placeholder="proveedor@ejemplo.com" 
            id="email">
          <div class="moda-feedback">
            Campo opcional
          </div>
        </div>
        
        <!-- Dirección -->
        <div class="moda-form-group moda-form-group-wide">
          <label for="direccion" class="moda-label">
            <i class="bi bi-geo-alt me-1"></i> Dirección
          </label>
          <textarea 
            v-model="formulario.direccion"
            maxlength="255" 
            class="moda-textarea"
            placeholder="Dirección completa del proveedor" 
            id="direccion"
            rows="3"></textarea>
          <div class="moda-feedback">
            Campo opcional
          </div>
        </div>
      </div>
      
      <!-- Nota de campos obligatorios -->
      <div class="moda-form-notes">
        <small class="moda-note">
          <i class="bi bi-asterisk text-danger"></i> Campos obligatorios
        </small>
      </div>
      
      <!-- Botones de acción -->
      <div class="moda-form-actions">
        <button type="submit" class="btn moda-btn-primary" :disabled="procesando">
          <i class="bi" :class="procesando ? 'bi-hourglass-split' : esEdicion ? 'bi-save' : 'bi-person-plus-fill'"></i>
          {{ procesando ? 'Procesando...' : (esEdicion ? 'Guardar Cambios' : 'Registrar Proveedor') }}
        </button>
        <button type="button" @click="limpiarFormulario" class="btn moda-btn-outline" :disabled="procesando">
          <i class="bi bi-eraser-fill me-2"></i> Limpiar
        </button>
        <button type="button" @click="volverALista" class="btn moda-btn-outline-secondary" :disabled="procesando">
          <i class="bi bi-arrow-left me-2"></i> Volver a la Lista
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import { 
  agregarProveedor, 
  editarProveedor, 
  obtenerProveedorPorDocIdentidad 
} from '@/proveedor.js'

const router = useRouter();
const route = useRoute();

const esEdicion = computed(() => route.name === 'edicion-proveedor');
const docIdentidad = route.params.doc_identidad;

const formulario = ref({
  doc_identidad: '',
  nombre: '',
  telefono: '',
  email: '',
  direccion: ''
});

const formularioEnviado = ref(false);
const mensaje = ref('');
const esError = ref(false);
const cargando = ref(false);
const procesando = ref(false);

// Cargar proveedor para edición
const cargarProveedor = async () => {
  if (!esEdicion.value) return;
  
  cargando.value = true;
  try {
    const data = await obtenerProveedorPorDocIdentidad(docIdentidad);
    formulario.value = {
      doc_identidad: data.doc_identidad,
      nombre: data.nombre,
      telefono: data.telefono || '',
      email: data.email || '',
      direccion: data.direccion || ''
    };
  } catch (error) {
    console.error('Error al cargar proveedor:', error);
    mensaje.value = `❌ No se pudieron cargar los datos del proveedor.`;
    esError.value = true;
    
    setTimeout(() => {
      router.push('/proveedor');
    }, 2000);
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarProveedor();
});

// Manejar envío del formulario
const manejarSubmit = async (event) => {
  formularioEnviado.value = true;
  const formElement = event.target;
  
  if (!formElement.checkValidity()) {
    return;
  }
  
  procesando.value = true;
  mensaje.value = '';
  esError.value = false;

  try {
    if (esEdicion.value) {
      // Actualizar proveedor existente
      const { doc_identidad, ...datosActualizados } = formulario.value;
      await editarProveedor(doc_identidad, datosActualizados);
      mensaje.value = '✅ Proveedor actualizado con éxito.';
    } else {
      // Registrar nuevo proveedor
      await agregarProveedor(formulario.value);
      mensaje.value = `✅ Proveedor ${formulario.value.nombre} registrado con éxito.`;
    }
    
    esError.value = false;
    
    setTimeout(() => {
      router.push('/proveedor');
    }, 1500);

  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Error en el servidor. Revise los datos.';
    mensaje.value = `❌ Fallo: ${errorMsg}`;
    esError.value = true;
  } finally {
    procesando.value = false;
  }
};

const limpiarFormulario = () => {
  if (!esEdicion.value) {
    formulario.value = {
      doc_identidad: '',
      nombre: '',
      telefono: '',
      email: '',
      direccion: ''
    };
  }
  formularioEnviado.value = false;
  mensaje.value = '';
  esError.value = false;
};

const volverALista = () => {
  router.push('/proveedor');
};
</script>

<style scoped>
/* Contenedor principal */
.moda-main-container {
  background-color: #FFFDFB;
  border-radius: 14px;
  border: 1px solid #D6CFC8;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(74, 59, 52, 0.1);
  max-width: 900px;
  margin: 2rem auto;
}

/* Título */
.moda-title {
  color: #3A2E2A;
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #D6CFC8;
}

.moda-icon-primary {
  color: #4A3B34;
}

/* Alertas */
.moda-alert {
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid;
  display: flex;
  align-items: center;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.moda-alert-success {
  background-color: rgba(25, 135, 84, 0.1);
  border-color: #198754;
  color: #198754;
}

.moda-alert-error {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: #dc3545;
  color: #dc3545;
}

/* Estado de carga */
.moda-loading-state {
  text-align: center;
  padding: 3rem;
}

.moda-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #D6CFC8;
  border-top-color: #4A3B34;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.moda-subtitle {
  color: #8B7355;
  font-weight: 500;
  font-size: 1rem;
}

/* Formulario */
.moda-form {
  background-color: #F8F5F2;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #D6CFC8;
}

.moda-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Grupos de formulario */
.moda-form-group {
  display: flex;
  flex-direction: column;
}

.moda-form-group-wide {
  grid-column: 1 / -1;
}

/* Labels */
.moda-label {
  color: #3A2E2A;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

/* Inputs */
.moda-input,
.moda-textarea {
  background-color: white;
  border: 2px solid #D6CFC8;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #3A2E2A;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

.moda-input:focus,
.moda-textarea:focus {
  border-color: #4A3B34;
  box-shadow: 0 0 0 3px rgba(74, 59, 52, 0.2);
  outline: none;
}

.moda-input:invalid:not(:focus):not(:placeholder-shown),
.moda-textarea:invalid:not(:focus):not(:placeholder-shown) {
  border-color: #dc3545;
}

.moda-textarea {
  resize: vertical;
  min-height: 100px;
}

.moda-input:disabled {
  background-color: #F8F5F2;
  color: #8B7355;
  cursor: not-allowed;
}

/* Feedback */
.moda-feedback {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  padding-left: 0.5rem;
}

.invalid-feedback {
  color: #dc3545;
}

/* Notas */
.moda-form-notes {
  margin-bottom: 1.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #D6CFC8;
}

.moda-note {
  color: #8B7355;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

/* Botones de acción */
.moda-form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #D6CFC8;
}

.moda-btn-primary {
  background-color: #4A3B34 !important;
  border-color: #4A3B34 !important;
  color: white !important;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.moda-btn-primary:hover:not(:disabled) {
  background-color: #352822 !important;
  border-color: #352822 !important;
  transform: translateY(-2px);
}

.moda-btn-outline {
  background-color: transparent !important;
  border: 2px solid #4A3B34 !important;
  color: #4A3B34 !important;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.moda-btn-outline:hover:not(:disabled) {
  background-color: #4A3B34 !important;
  color: white !important;
  transform: translateY(-2px);
}

.moda-btn-outline-secondary {
  background-color: transparent !important;
  border: 2px solid #8B7355 !important;
  color: #8B7355 !important;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.moda-btn-outline-secondary:hover:not(:disabled) {
  background-color: #8B7355 !important;
  color: white !important;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Validación */
.was-validated .moda-input:invalid,
.was-validated .moda-textarea:invalid {
  border-color: #dc3545;
}

.was-validated .moda-input:valid,
.was-validated .moda-textarea:valid {
  border-color: #198754;
}

/* Responsive */
@media (max-width: 768px) {
  .moda-main-container {
    padding: 1.5rem;
    margin: 1rem auto;
  }
  
  .moda-form {
    padding: 1.5rem;
  }
  
  .moda-form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .moda-form-actions {
    flex-direction: column;
  }
  
  .moda-form-actions button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .moda-title {
    font-size: 1.5rem;
  }
  
  .moda-form {
    padding: 1rem;
  }
}
</style>