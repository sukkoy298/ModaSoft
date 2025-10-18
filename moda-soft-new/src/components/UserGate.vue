<script setup>
import { reactive, ref } from 'vue'
import defaultUsers from '../data/users.js' // carga los usuarios de prueba

// Inicializar users: tomar de localStorage si existe, si no usar defaultUsers
const users = ref(JSON.parse(localStorage.getItem('modasoft_users') || 'null') || defaultUsers)

// Si no había usuarios en localStorage, guardamos los default
if (!localStorage.getItem('modasoft_users')) {
  localStorage.setItem('modasoft_users', JSON.stringify(users.value))
}

const currentUser = ref(JSON.parse(localStorage.getItem('modasoft_user') || 'null'))

const state = reactive({
  idInput: '',
  showRegister: false,
  registerData: { id: '', name: '', email: '' }
})

function checkId() {
  const found = users.value.find(u => u.id === state.idInput.trim())
  if (found) {
    currentUser.value = found
    localStorage.setItem('modasoft_user', JSON.stringify(found))
    state.idInput = ''
    state.showRegister = false
  } else {
    state.showRegister = true
    state.registerData.id = state.idInput.trim()
  }
}

function register() {
  const newUser = {
    id: state.registerData.id || String(Date.now()),
    name: state.registerData.name || 'Cliente',
    email: state.registerData.email || ''
  }
  users.value.push(newUser)
  localStorage.setItem('modasoft_users', JSON.stringify(users.value))
  currentUser.value = newUser
  localStorage.setItem('modasoft_user', JSON.stringify(newUser))
  state.showRegister = false
  state.registerData = { id: '', name: '', email: '' }
}

function logout() {
  currentUser.value = null
  localStorage.removeItem('modasoft_user')
}
</script>

<template>
  <div class="user-gate">
    <template v-if="currentUser">
      <div class="welcome">
        Bienvenido, <strong>{{ currentUser.name }}</strong> (ID: {{ currentUser.id }})
        <button @click="logout">Cerrar sesión</button>
      </div>
    </template>

    <template v-else>
      <div class="id-entry">
        <label>Ingresa tu ID de usuario</label>
        <input v-model="state.idInput" placeholder="Tu ID..." />
        <button @click="checkId">Continuar</button>
      </div>

      <div v-if="state.showRegister" class="register">
        <h4>Registro rápido</h4>
        <input v-model="state.registerData.name" placeholder="Nombre" />
        <input v-model="state.registerData.email" placeholder="Email" />
        <button @click="register">Registrarme</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.user-gate { padding:0.5rem 0; border-bottom:1px dashed #ddd; }
.id-entry, .register { display:flex; gap:0.5rem; margin-top:0.5rem; align-items:center; }
.id-entry input, .register input { padding:0.4rem; }
button { padding:0.4rem 0.6rem; }
.welcome { display:flex; gap:1rem; align-items:center; }
</style>