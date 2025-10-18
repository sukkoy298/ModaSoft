<script setup>
import { reactive, ref } from 'vue'
import defaultUsers from '../data/users.js' // usuarios de prueba

// Inicializar users desde localStorage o defaults
const users = ref(JSON.parse(localStorage.getItem('modasoft_users') || 'null') || defaultUsers)
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
    selectUser(found)
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
  selectUser(newUser)
  state.showRegister = false
  state.registerData = { id: '', name: '', email: '' }
}

function logout() {
  currentUser.value = null
  localStorage.removeItem('modasoft_user')
}

function selectUser(user) {
  currentUser.value = user
  localStorage.setItem('modasoft_user', JSON.stringify(user))
}
</script>

<template>
  <div class="user-gate">
    <template v-if="currentUser">
      <div class="welcome">
        Cliente, <strong>{{ currentUser.name }}</strong> (ID: {{ currentUser.id }})
        <button class="btn-ghost" @click="logout">Cerrar sesión</button>
      </div>
    </template>

    <template v-else>
      <div class="single-column">
        <div class="id-entry">
          <label>Ingresa la cédula del Cliente</label>
          <input v-model="state.idInput" placeholder="Cédula del Cliente" />
          <button @click="checkId">Continuar</button>
        </div>

        <div v-if="state.showRegister" class="register">
          <h4>Registro rápido</h4>
          <input v-model="state.registerData.id" placeholder="Cédula del Cliente" />
          <input v-model="state.registerData.name" placeholder="Nombre" />
          <input v-model="state.registerData.email" placeholder="Email" />
          <button @click="register">Registrarme</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.user-gate { padding:0.8rem 0; border-bottom:1px dashed #e6e6e6; }

/* Layout simplificado: una columna */
.single-column { max-width: 560px; }

.id-entry, .register {
  display:flex;
  gap:0.5rem;
  margin-top:0.6rem;
  align-items:center;
  flex-wrap:wrap;
}

.id-entry input, .register input {
  padding:0.45rem;
  flex:1 1 140px;
  border:1px solid #e9e9e9;
  border-radius:6px;
}

button {
  padding:0.45rem 0.7rem;
  border-radius:6px;
  cursor:pointer;
  border: none;
  background:#0b84ff;
  color:#fff;
}

.btn-ghost {
  background:transparent;
  color:#0b84ff;
  border:1px solid #e6e6e6;
}

.welcome {
  display:flex;
  gap:1rem;
  align-items:center;
}
</style>