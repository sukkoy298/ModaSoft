<script setup>
import { ref, computed } from 'vue'
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
            router.push('/listaCliente');
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
    router.push('/listaCliente');
};
</script>

<template>
    <Header />
    <div class="container mt-4">
        <header class="d-flex flex-row justify-content-center mb-4">
            <h1>{{ tituloFormulario }}</h1>
        </header>
        
        <!-- Mensaje de resultado -->
        <div v-if="mensaje" :class="['alert', esError ? 'alert-danger' : 'alert-success']" role="alert">
            {{ mensaje }}
        </div>
        
        <form 
            :class="['row g-3 border border-secondary-emphasis bg-light rounded p-4', { 'was-validated': formularioEnviado }]" 
            @submit.prevent="handleSubmit"
            novalidate
        >
            
            <div class="form-floating col-md-6">
                <input 
                    type="text" 
                    v-model="cedula" 
                    required 
                    maxlength="20" 
                    minlength="5" 
                    class="form-control"
                    placeholder="Cédula" 
                    id="floatingCedula">
                <label for="floatingCedula" class="form-label">Cédula *</label>
                <div class="invalid-feedback">
                    La cédula es requerida (mínimo 5 caracteres).
                </div>
            </div>
            
            <div class="form-floating col-md-6">
                <input type="text" v-model="nombre" required maxlength="100" minlength="3" class="form-control"
                    placeholder="Ingrese su nombre" id="floatingName">
                <label for="floatingName" class="form-label">Nombre completo *</label>
                <div class="invalid-feedback">
                    El nombre es requerido (mínimo 3 caracteres).
                </div>
            </div>
            
            <div class="col-md-6 form-floating">
                <input type="tel" v-model="telefono" required minlength="7" maxlength="15" class="form-control" id="floatingTel"
                    placeholder="Digite su número de teléfono">
                <label for="floatingTel" class="form-label">Teléfono *</label>
                <div class="invalid-feedback">
                    El teléfono es requerido (mínimo 7 dígitos).
                </div>
            </div>
            
            <div class="form-floating col-md-6">
                <input type="email" v-model="email" required maxlength="100" class="form-control" id="floatingEmail"
                    placeholder="Coloque su Email">
                <label for="floatingEmail" class="form-label">Email *</label>
                <div class="invalid-feedback">
                    El email es requerido y debe ser válido.
                </div>
            </div>
            
            <div class="form-floating col-12">
                <textarea v-model="direccion" required maxlength="255" class="form-control" id="floatingDireccion"
                    placeholder="Escriba su dirección" style="height: 80px;"></textarea>
                <label for="floatingDireccion" class="form-label">Dirección *</label>
                <div class="invalid-feedback">
                    La dirección es requerida.
                </div>
            </div>
            
            <div class="col-md-4">
                <label for="inputState" class="form-label">Tipo de Cliente *</label>
                <select id="inputState" v-model="tipo" required class="form-select">
                    <option value="Natural">Natural</option>
                    <option value="Jurídico">Jurídico</option>
                    <option value="Genérico">Genérico</option>
                </select>
                <div class="invalid-feedback">
                    Debe seleccionar un tipo de cliente.
                </div>
            </div>
            
            <div class="col-12">
                <small class="text-muted">* Campos obligatorios</small>
            </div>
            
            <div class="col-12 d-flex gap-2">
                <button type="submit" class="btn btn-success">
                    <i class="bi bi-person-plus-fill"></i> {{ textoBoton }}
                </button>
                <button type="button" @click="limpiarFormulario" class="btn btn-outline-secondary">
                    <i class="bi bi-eraser-fill"></i> Limpiar
                </button>
                <button type="button" @click="volverALista" class="btn btn-outline-primary">
                    <i class="bi bi-arrow-left"></i> Volver a la Lista
                </button>
            </div>
        </form>
    </div>
</template>