<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue' 
import { obtenerClientePorCedula, editarCliente } from '@/cliente.js' 

const router = useRouter();
const route = useRoute();

// OBTENER CÉDULA DESDE LOS PARÁMETROS DE LA RUTA
const cedula = route.params.cedula;

console.log('🔍 Cédula desde route.params:', cedula); // Para debug

const mensaje = ref('');
const esError = ref(false);
const cliente = ref({});

// 2. FUNCIÓN DE CARGA DE DATOS DEL CLIENTE
const cargarCliente = async () => {
    try {
        console.log('📡 Solicitando datos para cédula:', cedula);
        
        const data = await obtenerClientePorCedula(cedula);
        console.log('✅ Datos recibidos:', data);
        
        cliente.value = data; 
        
        // Formateo de fecha para el campo input type="date"
        if (cliente.value.fecha_registro) {
            cliente.value.fecha_registro = cliente.value.fecha_registro.split('T')[0];
        }
        
    } catch (error) {
        // Loguea el error real en consola
        console.error(`❌ Error al cargar cliente ${cedula}:`, error);
        console.error('🔍 Detalles del error:', error.response?.data);
        
        // Muestra un mensaje de error temporal al usuario
        mensaje.value = `❌ No se pudieron cargar los datos del cliente ${cedula}. Redirigiendo...`;
        esError.value = true;
        
        // Redirige después de un breve momento
        setTimeout(() => {
            router.push('/listaCliente'); 
        }, 1500); 
    }
};

onMounted(() => {
    console.log('🚀 Componente montado');
    console.log('📍 Ruta completa:', route.path);
    console.log('📋 Todos los params:', route.params);
    cargarCliente();
});

// 3. FUNCIÓN DE ACTUALIZACIÓN
const manejarEdicion = async () => {
    mensaje.value = '';
    esError.value = false;

    // Desestructuramos para separar la cédula del objeto de datos
    const { cedula, ...datosActualizados } = cliente.value; 

    try {
        await editarCliente(cedula, datosActualizados); 
        mensaje.value = '✅ Cliente actualizado con éxito.';
        esError.value = false;
        
        // Redirige a la lista después de actualizar
        setTimeout(() => {
            router.push('/listaCliente');
        }, 1500);

    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error al actualizar. Revise los datos.';
        mensaje.value = `❌ Fallo: ${errorMsg}`;
        esError.value = true;
    }
};

const navegarALista = () => {
    router.push('/listaCliente');
};
</script>

<template>
    <Header />
    <div class="container mt-5">
        <h1 class="text-center mb-4">Editar Cliente: {{ cliente.nombre || cedula }}</h1>
        <hr>

        <div v-if="mensaje" :class="['alert', esError ? 'alert-danger' : 'alert-success']" role="alert">
            {{ mensaje }}
        </div>

        <!--  MOSTRAR INFORMACIÓN DE DEBUG TEMPORALMENTE -->
        <div v-if="!cliente.cedula" class="alert alert-info">
            <strong>Debug Info:</strong><br>
            Cédula desde route: <code>{{ cedula }}</code><br>
            Ruta: <code>{{ route.path }}</code>
        </div>

        <form v-if="cliente.cedula" @submit.prevent="manejarEdicion" class="p-4 border rounded shadow-sm">
            
            <div class="mb-3">
                <label for="cedula" class="form-label">Cédula</label>
                <input type="text" class="form-control" id="cedula" v-model="cliente.cedula" disabled>
            </div>
            
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombre" v-model="cliente.nombre" required>
            </div>

            <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input type="tel" class="form-control" id="telefono" v-model="cliente.telefono">
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="cliente.email">
            </div>
            
            <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input type="text" class="form-control" id="direccion" v-model="cliente.direccion">
            </div>

            <div class="mb-3">
                <label for="tipo" class="form-label">Tipo de Cliente</label>
                <select class="form-select" id="tipo" v-model="cliente.tipo" required>
                    <option value="Natural">Natural</option>
                    <option value="Jurídico">Jurídico</option>
                    <option value="Genérico">Genérico</option> 
                </select>
            </div>

            <div class="mb-3">
                <label for="fechaRegistro" class="form-label">Fecha de Registro</label>
                <input type="date" class="form-control" id="fechaRegistro" v-model="cliente.fecha_registro" disabled>
            </div>
            
            <div class="d-flex justify-content-between pt-3">
                <button type="button" @click="navegarALista" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Volver a la Lista
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-save"></i> Guardar Cambios
                </button>
            </div>
        </form>
        <div v-else class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando datos del cliente {{ cedula }}...</p>
            <small class="text-muted">Si tarda mucho, verifique la consola del navegador</small>
        </div>
    </div>
</template>