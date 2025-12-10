<template>
    <Header />
    <div class="container moda-main-container mt-5">
        <h1 class="moda-title text-center mb-4">
            <i class="bi bi-person-plus-fill moda-icon-primary me-2"></i>
            {{ tituloFormulario }}
        </h1>
        
        <!-- Mensaje de resultado -->
        <div v-if="mensaje" :class="['moda-alert', esError ? 'moda-alert-error' : 'moda-alert-success']" role="alert">
            <i :class="['bi me-2', esError ? 'bi-exclamation-triangle' : 'bi-check-circle']"></i>
            {{ mensaje }}
        </div>
        
        <form 
            class="moda-form"
            @submit.prevent="handleSubmit"
            novalidate
            :class="{ 'was-validated': formularioEnviado }"
        >
            <div class="moda-form-grid">
                <!-- Cédula -->
                <div class="moda-form-group">
                    <label for="floatingCedula" class="moda-label">
                        <i class="bi bi-card-text me-1"></i> Cédula *
                    </label>
                    <input 
                        type="text" 
                        v-model="cedula" 
                        required 
                        maxlength="20" 
                        minlength="5" 
                        class="moda-input"
                        placeholder="Ej: 12345678" 
                        id="floatingCedula">
                    <div class="moda-feedback invalid-feedback">
                        La cédula es requerida (mínimo 5 caracteres).
                    </div>
                </div>
                
                <!-- Nombre -->
                <div class="moda-form-group">
                    <label for="floatingName" class="moda-label">
                        <i class="bi bi-person me-1"></i> Nombre completo *
                    </label>
                    <input 
                        type="text" 
                        v-model="nombre" 
                        required 
                        maxlength="100" 
                        minlength="3" 
                        class="moda-input"
                        placeholder="Ingrese su nombre completo" 
                        id="floatingName">
                    <div class="moda-feedback invalid-feedback">
                        El nombre es requerido (mínimo 3 caracteres).
                    </div>
                </div>
                
                <!-- Teléfono -->
                <div class="moda-form-group">
                    <label for="floatingTel" class="moda-label">
                        <i class="bi bi-telephone me-1"></i> Teléfono *
                    </label>
                    <input 
                        type="tel" 
                        v-model="telefono" 
                        required 
                        minlength="7" 
                        maxlength="15" 
                        class="moda-input"
                        placeholder="Ej: 0414-1234567" 
                        id="floatingTel">
                    <div class="moda-feedback invalid-feedback">
                        El teléfono es requerido (mínimo 7 dígitos).
                    </div>
                </div>
                
                <!-- Email -->
                <div class="moda-form-group">
                    <label for="floatingEmail" class="moda-label">
                        <i class="bi bi-envelope me-1"></i> Email *
                    </label>
                    <input 
                        type="email" 
                        v-model="email" 
                        required 
                        maxlength="100" 
                        class="moda-input"
                        placeholder="ejemplo@correo.com" 
                        id="floatingEmail">
                    <div class="moda-feedback invalid-feedback">
                        El email es requerido y debe ser válido.
                    </div>
                </div>
                
                <!-- Dirección -->
                <div class="moda-form-group moda-form-group-wide">
                    <label for="floatingDireccion" class="moda-label">
                        <i class="bi bi-geo-alt me-1"></i> Dirección *
                    </label>
                    <textarea 
                        v-model="direccion" 
                        required 
                        maxlength="255" 
                        class="moda-textarea"
                        placeholder="Escriba su dirección completa" 
                        id="floatingDireccion"
                        rows="3"></textarea>
                    <div class="moda-feedback invalid-feedback">
                        La dirección es requerida.
                    </div>
                </div>
                
                <!-- Tipo de Cliente -->
                <div class="moda-form-group">
                    <label for="inputState" class="moda-label">
                        <i class="bi bi-tag me-1"></i> Tipo de Cliente *
                    </label>
                    <select 
                        id="inputState" 
                        v-model="tipo" 
                        required 
                        class="moda-select">
                        <option value="Natural">Natural</option>
                        <option value="Jurídico">Jurídico</option>
                        <option value="Genérico">Genérico</option>
                    </select>
                    <div class="moda-feedback invalid-feedback">
                        Debe seleccionar un tipo de cliente.
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
                <button type="submit" class="btn moda-btn-primary">
                    <i class="bi bi-person-plus-fill me-2"></i> {{ textoBoton }}
                </button>
                <button type="button" @click="limpiarFormulario" class="btn moda-btn-outline">
                    <i class="bi bi-eraser-fill me-2"></i> Limpiar
                </button>
                <button type="button" @click="volverALista" class="btn moda-btn-outline-secondary">
                    <i class="bi bi-arrow-left me-2"></i> Volver
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue' // <-- Importa onMounted
import { useRouter } from 'vue-router'
import { agregarCliente } from '@/cliente.js';
import Header from '@/components/Header.vue';

const router = useRouter();

// Datos del formulario
const cedula = ref('');
const nombre = ref('');
const telefono = ref('');
const email = ref('');
const direccion = ref('');
const tipo = ref('Natural');
const formularioEnviado = ref(false);
const mensaje = ref('');
const esError = ref(false);

const tituloFormulario = computed(() => {
    // Si la cédula ya está precargada, podemos ajustar el título si es necesario
    return 'Registrar Nuevo Cliente';
});

const textoBoton = computed(() => {
    return 'Registrar';
});

const handleSubmit = async (event) => {
    formularioEnviado.value = true;
    const formElement = event.target;

    if (!formElement.checkValidity()) {
        return;
    }

    const datosCliente = {
        cedula: cedula.value,
        nombre: nombre.value,
        telefono: telefono.value,
        email: email.value,
        direccion: direccion.value,
        tipo: tipo.value,
    };

    try {
        const resultado = await agregarCliente(datosCliente);

        if (resultado.accion === 'reactivado') {
            mensaje.value = `✅ Cliente reactivado y actualizado exitosamente.`;
        } else {
            mensaje.value = `✅ Cliente ${nombre.value} registrado con éxito.`;
        }

        esError.value = false;

        setTimeout(() => {
            // Después de registrar, puedes enviarlo de vuelta a la facturación
            router.push('/facturacion');
        }, 1500);

    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error de conexión con el servidor.';
        mensaje.value = `❌ Error: ${errorMsg}`;
        esError.value = true;
    }
};

const limpiarFormulario = () => {
    cedula.value = '';
    nombre.value = '';
    telefono.value = '';
    email.value = '';
    direccion.value = '';
    tipo.value = 'Natural';
    formularioEnviado.value = false;
    mensaje.value = '';
    esError.value = false;
};

const volverALista = () => {
    router.push('/facturacion'); // <-- Volver a facturación o a consultaCliente si prefieres
};

onMounted(() => {
    // NUEVO: Cargar cédula desde localStorage si viene de facturación
    const cedulaGuardada = localStorage.getItem('modasoft_cedula_para_registro');
    if (cedulaGuardada) {
        cedula.value = cedulaGuardada;
        localStorage.removeItem('modasoft_cedula_para_registro'); // Limpiar para futuras visitas
    }
});
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
}

/* Inputs */
.moda-input,
.moda-textarea,
.moda-select {
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
.moda-textarea:focus,
.moda-select:focus {
    border-color: #4A3B34;
    box-shadow: 0 0 0 3px rgba(74, 59, 52, 0.2);
    outline: none;
}

.moda-input:invalid:not(:focus):not(:placeholder-shown),
.moda-textarea:invalid:not(:focus):not(:placeholder-shown),
.moda-select:invalid:not(:focus) {
    border-color: #dc3545;
}

.moda-textarea {
    resize: vertical;
    min-height: 100px;
}

.moda-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%233A2E2A' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
    padding-right: 2.5rem;
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

.moda-btn-primary:hover {
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

.moda-btn-outline:hover {
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

.moda-btn-outline-secondary:hover {
    background-color: #8B7355 !important;
    color: white !important;
    transform: translateY(-2px);
}

/* Validación */
.was-validated .moda-input:invalid,
.was-validated .moda-textarea:invalid,
.was-validated .moda-select:invalid {
    border-color: #dc3545;
}

.was-validated .moda-input:valid,
.was-validated .moda-textarea:valid,
.was-validated .moda-select:valid {
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