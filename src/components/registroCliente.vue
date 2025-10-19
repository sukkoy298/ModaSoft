<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { agregarCliente, existeCliente, editarCliente, clienteAEditar, limpiarClienteAEditar } from '@/cliente.js';

const router = useRouter(); 

const id = ref(null); 
const nombre = ref('');
const telefono = ref('');
const email = ref('');
const direccion = ref('');
const tipo = ref('');
const formularioEnviado = ref(false);

const tituloFormulario = computed(() => {
    return id.value ? 'Editar Cliente' : 'Registrar Nuevo Cliente';
});

const textoBoton = computed(() => {
    return id.value ? 'Guardar Cambios' : 'Registrar';
});

onMounted(() => {
    if (clienteAEditar.value) {
        id.value = clienteAEditar.value.id;
        nombre.value = clienteAEditar.value.nombre;
        telefono.value = clienteAEditar.value.telefono;
        email.value = clienteAEditar.value.email;
        direccion.value = clienteAEditar.value.direccion;
        tipo.value = clienteAEditar.value.tipo;
    }
});


const handleSubmit = (event) => {
    formularioEnviado.value = true;
    const formElement = event.target;
    
    if (!formElement.checkValidity()) {
        return;
    }

    if (id.value) {
        
        editarCliente(
            id.value,
            nombre.value,
            telefono.value,
            email.value,
            direccion.value,
            tipo.value
        );
        
        limpiarClienteAEditar(); 
        alert(`✅ Cliente ${nombre.value} (ID: ${id.value}) actualizado con éxito.`);
        
    } else {
        if (existeCliente(email.value, telefono.value)) {
            alert('❌ ¡Error! Ya existe un cliente registrado con ese correo electrónico o número de teléfono. 🛑');
            return;
        }

        const nuevoCliente = {
            nombre: nombre.value, 
            telefono: telefono.value,
            email: email.value,
            direccion: direccion.value,
            tipo: tipo.value,
            fecha_registro: new Date().toISOString().slice(0, 10) 
        };
        
        agregarCliente(nuevoCliente);
        alert(`✅ Cliente ${nombre.value} registrado con éxito.`);
    }

    router.push('/listaCliente');
};
</script>

<template>
    <header class="d-flex flex-row justify-content-center mt-5">
        <h1>{{ tituloFormulario }}</h1>
    </header>
    <form 
        :class="['row m-5 g-3 border border-secondary-emphasis bg-light rounded', { 'was-validated': formularioEnviado }]" 
        @submit.prevent="handleSubmit"
        novalidate
    >
        <div class="form-floating col-md-6">
            <input type="text" v-model="nombre" required maxlength="20" minlength="3" class="form-control"
                placeholder="Ingrese su nombre" id="floatingName">
            <label for="floatingName" class="form-label">Ingrese su nombre</label>
            <div class="invalid-feedback">
                El nombre es requerido y debe tener entre 3 y 20 caracteres.
            </div>
        </div>
        
        <div class="col-md-6 form-floating">
            <input type="tel" v-model="telefono" required minlength="11" maxlength="11" class="form-control" id="floatingTel"
                placeholder="Digite su número de teléfono">
            <label for="floatingTel" class="form-label">Digite su número de teléfono</label>
            <div class="invalid-feedback">
                El teléfono es requerido y debe tener 11 dígitos.
            </div>
        </div>
        
        <div class="form-floating col-12">
            <input type="email" v-model="email" required minlength="12" maxlength="50" class="form-control" id="floatingEmail"
                placeholder="Coloque su Email">
            <label for="floatingEmail" class="form-label">Email</label>
            <div class="invalid-feedback">
                El email es requerido y debe ser válido.
            </div>
        </div>
        
        <div class="form-floating col-12">
            <input type="text" v-model="direccion" required minlength="25" maxlength="100" class="form-control" id="floatingDireccion"
                placeholder="Escriba su dirección">
            <label for="floatingDireccion" class="form-label">Dirección</label>
            <div class="invalid-feedback">
                La dirección es requerida y debe tener entre 25 y 100 caracteres.
            </div>
        </div>
        
        <div class="col-md-4">
            <label for="inputState" class="form-label">Tipo</label>
            <select id="inputState" v-model="tipo" required class="form-select">
                <option value="" disabled selected>Seleccione el tipo</option> 
                <option value="Natural">Natural</option>
                <option value="Juridico">Jurídico</option>
            </select>
            <div class="invalid-feedback">
                Debe seleccionar un tipo de cliente.
            </div>
        </div>
        
        <div class="col-12">
            <button type="submit" class="btn btn-outline-success text-dark mb-2">
                {{ textoBoton }}
            </button>
        </div>
    </form>
</template>
