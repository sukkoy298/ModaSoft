<template>
    <Header />
    <div class="container mt-5 mb-5">
        <div class="container py-4">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8">
                    <div class="card moda-card">
                        <div class="card-body">
                            <h4 class="mb-3">Perfil de Usuario</h4>
                            
                            <!-- Mensajes de éxito/error -->
                            <div v-if="successMsg" class="alert alert-success alert-dismissible fade show" role="alert">
                                {{ successMsg }}
                                <button type="button" class="btn-close" @click="successMsg = ''"></button>
                            </div>
                            <div v-if="errorMsg" class="alert alert-danger alert-dismissible fade show" role="alert">
                                {{ errorMsg }}
                                <button type="button" class="btn-close" @click="errorMsg = ''"></button>
                            </div>
                            
                            <div v-if="loading" class="text-center py-4">Cargando...</div>
                            <div v-else>
                                <form @submit.prevent="onSubmit">
                                    <div class="mb-3">
                                        <label class="form-label fw-bold">Usuario</label>
                                        <input v-if="editing" v-model="form.usuario" class="form-control" :class="{'is-invalid': formErrors.usuario}" />
                                        <div v-else class="form-control-plaintext">{{ usuario.usuario }}</div>
                                        <div v-if="formErrors.usuario" class="invalid-feedback">{{ formErrors.usuario }}</div>
                                    </div>

                                    <div class="mb-3" v-if="editing">
                                        <label class="form-label fw-bold">Nueva contraseña</label>
                                        <input type="password" v-model="form.password" class="form-control" :class="{'is-invalid': formErrors.password}" />
                                        <small class="text-muted">Dejar en blanco si no quieres cambiarla</small>
                                        <div v-if="formErrors.password" class="invalid-feedback">{{ formErrors.password }}</div>
                                    </div>

                                    <div class="mb-3" v-if="editing && form.password">
                                        <label class="form-label fw-bold">Confirmar contraseña</label>
                                        <input type="password" v-model="form.passwordConfirm" class="form-control" :class="{'is-invalid': formErrors.passwordConfirm}" />
                                        <div v-if="formErrors.passwordConfirm" class="invalid-feedback">{{ formErrors.passwordConfirm }}</div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label fw-bold">Rol</label>
                                        <div class="form-control-plaintext">{{ rolNombre }}</div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label fw-bold">Fecha de registro</label>
                                        <div class="form-control-plaintext">{{ formatDate(usuario.created_at) }}</div>
                                    </div>

                                    <div class="d-flex gap-2 mt-4">
                                        <button type="button" class="btn btn-moda-outline" @click="$router.push('/')">Volver</button>
                                        <button v-if="!editing" type="button" class="btn btn-moda-primary" @click="startEditing">Editar</button>
                                        <button v-if="editing" type="submit" class="btn btn-moda-primary" :disabled="saving">
                                            <span v-if="saving">Guardando...</span>
                                            <span v-else>Guardar</span>
                                        </button>
                                        <button v-if="editing" type="button" class="btn btn-secondary" @click="cancelEditing" :disabled="saving">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { getToken, getUser, saveAuth, logout } from '../auth.js'

const router = useRouter()
const usuario = ref({})
const loading = ref(true)
const saving = ref(false)
const userLocal = getUser()

const editing = ref(false)
const form = ref({ usuario: '', password: '', passwordConfirm: '' })
const formErrors = ref({})
const errorMsg = ref('')
const successMsg = ref('')

const rolNombre = computed(() => {
    const r = usuario.value?.id_rol || userLocal?.id_rol
    if (r === 1) return 'Administrador'
    if (r === 2) return 'Vendedor'
    if (r === 3) return 'Almacén'
    return 'Usuario'
})

function formatDate(dateString) {
    if (!dateString) return ''
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return dateString
    }
}

async function load() {
    loading.value = true
    errorMsg.value = ''
    try {
        const token = getToken()
        if (!token) {
            throw new Error('No hay sesión activa')
        }
        
        console.log('🔍 Cargando perfil...')
        
        const userId = userLocal?.id_usuario
        if (!userId) {
            throw new Error('ID de usuario no disponible')
        }
        
        const headers = { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        
        // Usar la ruta que SÍ funciona: /api/usuarios/:id
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const response = await axios.get(`${baseURL}/api/usuarios/${userId}`, { headers })
        
        console.log('✅ Perfil cargado:', response.data)
        
        // La respuesta viene directamente con los datos del usuario
        usuario.value = response.data
        form.value.usuario = usuario.value.usuario || ''
        
    } catch (err) {
        console.error('❌ Error cargando perfil:', err)
        
        if (err.response?.status === 401) {
            errorMsg.value = 'Sesión expirada. Por favor, inicie sesión nuevamente.'
            logout()
            setTimeout(() => router.push('/login'), 2000)
        } else if (err.response?.status === 404) {
            errorMsg.value = 'Usuario no encontrado en el servidor'
        } else if (err.message.includes('Network Error')) {
            errorMsg.value = 'Error de conexión con el servidor'
        } else {
            errorMsg.value = err.response?.data?.message || err.message || 'Error al cargar el perfil'
        }
        
        // Cargar datos locales como fallback
        if (userLocal) {
            console.log('🔄 Usando datos locales como fallback')
            usuario.value = userLocal
            form.value.usuario = usuario.value.usuario || ''
        }
    } finally {
        loading.value = false
    }
}

function startEditing() {
    errorMsg.value = ''
    successMsg.value = ''
    formErrors.value = {}
    editing.value = true
    form.value.password = ''
    form.value.passwordConfirm = ''
}

function cancelEditing() {
    errorMsg.value = ''
    successMsg.value = ''
    formErrors.value = {}
    editing.value = false
    form.value.usuario = usuario.value.usuario || ''
    form.value.password = ''
    form.value.passwordConfirm = ''
}

function validateForm() {
    formErrors.value = {}
    let isValid = true

    if (!form.value.usuario.trim()) {
        formErrors.value.usuario = 'El usuario es requerido'
        isValid = false
    } else if (form.value.usuario.length < 3) {
        formErrors.value.usuario = 'El usuario debe tener al menos 3 caracteres'
        isValid = false
    }

    if (form.value.password) {
        if (form.value.password.length < 6) {
            formErrors.value.password = 'La contraseña debe tener al menos 6 caracteres'
            isValid = false
        }
        
        if (form.value.password !== form.value.passwordConfirm) {
            formErrors.value.passwordConfirm = 'Las contraseñas no coinciden'
            isValid = false
        }
    }

    return isValid
}

async function onSubmit() {
    errorMsg.value = ''
    successMsg.value = ''
    formErrors.value = {}
    
    if (!validateForm()) {
        return
    }

    saving.value = true

    const payload = {}
    if (form.value.usuario !== usuario.value.usuario) {
        payload.usuario = form.value.usuario
    }
    if (form.value.password) {
        payload.password = form.value.password
    }

    if (Object.keys(payload).length === 0) {
        successMsg.value = 'No hay cambios para guardar.'
        editing.value = false
        saving.value = false
        return
    }

    try {
        const id = usuario.value.id_usuario || userLocal?.id_usuario
        if (!id) {
            throw new Error('ID de usuario no disponible')
        }

        const token = getToken()
        if (!token) {
            throw new Error('Token no disponible')
        }
        
        const headers = { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const { data } = await axios.put(`${baseURL}/api/usuarios/${id}`, payload, { headers })
        
        // Actualizar datos locales
        if (data.usuario) {
            usuario.value = { ...usuario.value, ...data.usuario }
            // Actualizar localStorage
            const updatedUser = { ...userLocal, ...data.usuario }
            saveAuth({ token, usuario: updatedUser })
            
            successMsg.value = data.message || 'Perfil actualizado exitosamente.'
        } else {
            successMsg.value = data.message || 'Actualización completada.'
        }
        
        editing.value = false
    } catch (err) {
        console.error('❌ Error actualizando perfil:', err)
        
        if (err.response?.status === 401) {
            errorMsg.value = 'Sesión expirada. Por favor, inicie sesión nuevamente.'
            logout()
            setTimeout(() => router.push('/login'), 2000)
        } else if (err.response?.status === 403) {
            errorMsg.value = 'No tiene permisos para realizar esta acción'
        } else if (err.response?.status === 404) {
            errorMsg.value = 'Usuario no encontrado en el servidor'
        } else if (err.response?.status === 400) {
            const serverMsg = err.response?.data?.message || ''
            if (serverMsg.includes('ya existe') || serverMsg.includes('duplicate')) {
                formErrors.value.usuario = 'Este nombre de usuario ya está en uso'
            } else {
                errorMsg.value = serverMsg || 'Error en los datos enviados'
            }
        } else if (err.message.includes('Network Error')) {
            errorMsg.value = 'Error de conexión con el servidor'
        } else {
            errorMsg.value = err.response?.data?.message || err.message || 'Error al actualizar el perfil.'
        }
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    // Verificar si hay usuario logueado
    if (!userLocal) {
        errorMsg.value = 'Debe iniciar sesión para ver su perfil'
        setTimeout(() => router.push('/login'), 2000)
        return
    }
    load()
})
</script>

<style scoped>
.moda-card { 
    padding: 1.5rem; 
    border-radius: 12px; 
    border: 1px solid #dee2e6;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.form-control-plaintext { 
    padding: 0.5rem 0; 
    color: #3A2E2A; 
    min-height: calc(2.25rem + 2px);
}
.btn-moda-outline { 
    border: 2px solid #4A3B34; 
    color: #4A3B34; 
    background: transparent;
    font-weight: 600;
}
.btn-moda-outline:hover {
    background-color: #4A3B34;
    color: white;
}
.btn-moda-primary { 
    background-color: #4A3B34; 
    color: white;
    border: none;
    font-weight: 600;
}
.btn-moda-primary:hover {
    background-color: #3A2E2A;
}
.btn-moda-primary:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}
.alert {
    border-radius: 8px;
}
.invalid-feedback {
    display: block;
}
</style>