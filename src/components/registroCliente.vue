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
const tipo = ref('');
const formularioEnviado = ref(false);

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
    
    let mensaje = '';
    let exito = false;

    try {
        await agregarCliente(datosCliente);
        mensaje = `✅ Cliente ${nombre.value} registrado con éxito.`;
        exito = true;

    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error de conexión con el servidor o datos inválidos.';
        mensaje = `❌ Error: ${errorMsg}`;
    }
    
    alert(mensaje);
    if (exito) {
        router.push('/listaCliente');
    }
};

const limpiarFormulario = () => {
    cedula.value = '';
    nombre.value = '';
    telefono.value = '';
    email.value = '';
    direccion.value = '';
    tipo.value = '';
    formularioEnviado.value = false;
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
                    maxlength="30" 
                    minlength="5" 
                    class="form-control"
                    placeholder="Cédula" 
                    id="floatingCedula">
                <label for="floatingCedula" class="form-label">Cédula</label>
                <div class="invalid-feedback">
                    La cédula es requerida (mínimo 5 caracteres).
                </div>
            </div>
            
            <div class="form-floating col-md-6">
                <input type="text" v-model="nombre" required maxlength="150" minlength="3" class="form-control"
                    placeholder="Ingrese su nombre" id="floatingName">
                <label for="floatingName" class="form-label">Nombre completo</label>
                <div class="invalid-feedback">
                    El nombre es requerido (mínimo 3 caracteres).
                </div>
            </div>
            
            <div class="col-md-6 form-floating">
                <input type="tel" v-model="telefono" required minlength="7" maxlength="20" class="form-control" id="floatingTel"
                    placeholder="Digite su número de teléfono">
                <label for="floatingTel" class="form-label">Teléfono</label>
                <div class="invalid-feedback">
                    El teléfono es requerido (mínimo 7 dígitos).
                </div>
            </div>
            
            <div class="form-floating col-md-6">
                <input type="email" v-model="email" required maxlength="100" class="form-control" id="floatingEmail"
                    placeholder="Coloque su Email">
                <label for="floatingEmail" class="form-label">Email</label>
                <div class="invalid-feedback">
                    El email es requerido y debe ser válido.
                </div>
            </div>
            
            <div class="form-floating col-12">
                <input type="text" v-model="direccion" required maxlength="255" class="form-control" id="floatingDireccion"
                    placeholder="Escriba su dirección">
                <label for="floatingDireccion" class="form-label">Dirección</label>
                <div class="invalid-feedback">
                    La dirección es requerida.
                </div>
            </div>
            
            <div class="col-md-4">
                <label for="inputState" class="form-label">Tipo de Cliente</label>
                <select id="inputState" v-model="tipo" required class="form-select">
                    <option value="" disabled selected>Seleccione el tipo</option> 
                    <option value="Natural">Natural</option>
                    <option value="Jurídico">Jurídico</option>
                    <option value="Genérico">Genérico</option>
                </select>
                <div class="invalid-feedback">
                    Debe seleccionar un tipo de cliente.
                </div>
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