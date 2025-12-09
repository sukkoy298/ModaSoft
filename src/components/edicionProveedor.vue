<template>
    <Header />
    <div class="container moda-main-container mt-5">
        <h1 class="moda-title text-center mb-4">
            <i class="bi bi-person-gear moda-icon-primary me-2"></i>
            Editar Proveedor: {{ proveedor.nombre || doc_identidad }}
        </h1>
        
        <!-- Mensaje de resultado -->
        <div v-if="mensaje" :class="['moda-alert', esError ? 'moda-alert-error' : 'moda-alert-success']" role="alert">
            <i :class="['bi me-2', esError ? 'bi-exclamation-triangle' : 'bi-check-circle']"></i>
            {{ mensaje }}
        </div>
        
        <!-- Estado de carga -->
        <div v-else-if="!proveedor.doc_identidad && !esError" class="moda-loading-state">
            <div class="moda-spinner"></div>
            <p class="mt-3 moda-subtitle">Cargando datos del proveedor {{ doc_identidad }}...</p>
        </div>
        
        <!-- Formulario de edición -->
        <form v-if="proveedor.doc_identidad" @submit.prevent="manejarEdicion" class="moda-form">
            <!-- Documento de Identidad (solo lectura) -->
            <div class="moda-form-group">
                <label for="doc_identidad" class="moda-label">
                    <i class="bi bi-card-text me-1"></i> Documento de Identidad
                </label>
                <div class="moda-readonly-field">
                    {{ proveedor.doc_identidad }}
                </div>
                <div class="moda-note">
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
                    class="moda-input" 
                    id="nombre" 
                    v-model="proveedor.nombre" 
                    required
                    placeholder="Nombre completo del proveedor">
                <div class="moda-feedback">
                    Campo obligatorio
                </div>
            </div>

            <!-- Teléfono -->
            <div class="moda-form-group">
                <label for="telefono" class="moda-label">
                    <i class="bi bi-telephone me-1"></i> Teléfono
                </label>
                <input 
                    type="tel" 
                    class="moda-input" 
                    id="telefono" 
                    v-model="proveedor.telefono" 
                    placeholder="Número de teléfono">
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
                    class="moda-input" 
                    id="email" 
                    v-model="proveedor.email" 
                    placeholder="correo@ejemplo.com">
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
                    class="moda-textarea" 
                    id="direccion" 
                    v-model="proveedor.direccion" 
                    rows="3" 
                    placeholder="Dirección completa"></textarea>
                <div class="moda-feedback">
                    Campo opcional
                </div>
            </div>
            
            <!-- Fecha de Registro (solo lectura) -->
            <div class="moda-form-group">
                <label class="moda-label">
                    <i class="bi bi-calendar me-1"></i> Fecha de Registro
                </label>
                <div class="moda-readonly-field">
                    {{ formatearFecha(proveedor.created_at) }}
                </div>
            </div>

            <!-- Última Actualización (solo lectura) -->
            <div class="moda-form-group">
                <label class="moda-label">
                    <i class="bi bi-clock-history me-1"></i> Última Actualización
                </label>
                <div class="moda-readonly-field">
                    {{ formatearFecha(proveedor.updated_at) }}
                </div>
            </div>
            
            <!-- Nota de campos obligatorios -->
            <div class="moda-form-notes">
                <small class="moda-note">
                    <i class="bi bi-asterisk moda-text-primary"></i> Campos obligatorios
                </small>
            </div>
            
            <!-- Botones de acción -->
            <div class="moda-form-actions">
                <button type="button" @click="navegarALista" class="btn moda-btn-outline-secondary">
                    <i class="bi bi-arrow-left me-2"></i> Volver a la Lista
                </button>
                <button type="submit" class="btn moda-btn-primary" :disabled="procesando">
                    <i class="bi" :class="procesando ? 'bi-hourglass-split' : 'bi-save'"></i>
                    {{ procesando ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue' 
import { obtenerProveedorPorDocIdentidad, editarProveedor } from '@/proveedor.js' 

const router = useRouter();
const route = useRoute();

const doc_identidad = route.params.doc_identidad;
const mensaje = ref('');
const esError = ref(false);
const procesando = ref(false);
const proveedor = ref({
    doc_identidad: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    created_at: '',
    updated_at: ''
});

const cargarProveedor = async () => {
    try {
        const data = await obtenerProveedorPorDocIdentidad(doc_identidad);
        proveedor.value = {
            doc_identidad: data.doc_identidad,
            nombre: data.nombre || '',
            telefono: data.telefono || '',
            email: data.email || '',
            direccion: data.direccion || '',
            created_at: data.created_at || '',
            updated_at: data.updated_at || ''
        };
        
    } catch (error) {
        console.error(`❌ Error al cargar proveedor ${doc_identidad}:`, error);
        mensaje.value = `❌ No se pudieron cargar los datos del proveedor ${doc_identidad}.`;
        esError.value = true;
        
        setTimeout(() => {
            router.push('/proveedor'); 
        }, 2000); 
    }
};

const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    try {
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
};

onMounted(() => {
    cargarProveedor();
});

const manejarEdicion = async () => {
    mensaje.value = '';
    esError.value = false;
    procesando.value = true;

    try {
        // Enviar solo los datos editables
        const { doc_identidad, created_at, updated_at, ...datosActualizados } = proveedor.value;
        
        await editarProveedor(doc_identidad, datosActualizados); 
        mensaje.value = '✅ Proveedor actualizado con éxito.';
        esError.value = false;
        
        setTimeout(() => {
            router.push('/proveedor');
        }, 1500);

    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error al actualizar. Revise los datos.';
        mensaje.value = `❌ Fallo: ${errorMsg}`;
        esError.value = true;
    } finally {
        procesando.value = false;
    }
};

const navegarALista = () => {
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

.moda-text-primary {
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

.moda-form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
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

/* Campo de solo lectura */
.moda-readonly-field {
    background-color: #FFFDFB;
    border: 2px solid #D6CFC8;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #8B7355;
    font-weight: 500;
    font-size: 1rem;
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

.moda-textarea {
    resize: vertical;
    min-height: 100px;
}

/* Feedback */
.moda-feedback {
    margin-top: 0.25rem;
    font-size: 0.85rem;
    padding-left: 0.5rem;
    color: #8B7355;
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
    justify-content: space-between;
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
    min-width: 180px;
    justify-content: center;
}

.moda-btn-primary:hover:not(:disabled) {
    background-color: #352822 !important;
    border-color: #352822 !important;
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
    min-width: 180px;
    justify-content: center;
}

.moda-btn-outline-secondary:hover {
    background-color: #8B7355 !important;
    color: white !important;
    transform: translateY(-2px);
}

.moda-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
    
    .moda-form-actions {
        flex-direction: column;
    }
    
    .moda-form-actions button {
        width: 100%;
    }
}

@media (max-width: 576px) {
    .moda-title {
        font-size: 1.5rem;
    }
    
    .moda-form {
        padding: 1rem;
    }
    
    .moda-btn-primary,
    .moda-btn-outline-secondary {
        min-width: 100%;
    }
}
</style>