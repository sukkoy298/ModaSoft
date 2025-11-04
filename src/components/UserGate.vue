<script setup>
import { reactive, ref } from 'vue'
import defaultUsers from '../data/users.js'

const users = ref(JSON.parse(localStorage.getItem('modasoft_users') || 'null') || defaultUsers)
if (!localStorage.getItem('modasoft_users')) localStorage.setItem('modasoft_users', JSON.stringify(users.value))

const currentUser = ref(JSON.parse(localStorage.getItem('modasoft_user') || 'null'))

const state = reactive({ idInput: '', showRegister: false, registerData: { id: '', name: '', email: '' } })

function checkId() {
  const found = users.value.find(u => u.id === state.idInput.trim())
  if (found) selectUser(found)
  else { state.showRegister = true; state.registerData.id = state.idInput.trim() }
}

function register() {
  const newUser = { id: state.registerData.id || String(Date.now()), name: state.registerData.name || 'Cliente', email: state.registerData.email || '' }
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
  <div class="mb-3">
    <div v-if="currentUser" class="alert alert-light d-flex justify-content-between align-items-center">
      <div>
        Cliente: <strong>{{ currentUser.name }}</strong>
        <div class="small text-muted">ID: {{ currentUser.id }}</div>
      </div>
      <button class="btn btn-sm btn-outline-secondary" @click="logout">Cerrar sesión</button>
    </div>

    <div v-else class="card mb-3">
      <div class="card-body">
        <div class="row g-2 align-items-center">
          <div class="col-auto">
            <input v-model="state.idInput" class="form-control" placeholder="Cédula del Cliente">
          </div>
          <div class="col-auto">
            <button class="btn btn-primary" @click="checkId">Continuar</button>
          </div>
        </div>

        <div v-if="state.showRegister" class="mt-3">
          <h6>Registro rápido</h6>
          <div class="row g-2">
            <div class="col-12 col-md-4">
              <input v-model="state.registerData.id" class="form-control" placeholder="Cédula">
            </div>
            <div class="col-12 col-md-4">
              <input v-model="state.registerData.name" class="form-control" placeholder="Nombre">
            </div>
            <div class="col-12 col-md-4">
              <input v-model="state.registerData.email" class="form-control" placeholder="Email">
            </div>
            <div class="col-12 mt-2">
              <button class="btn btn-success" @click="register">Registrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Depende de Bootstrap; estilos mínimos */
</style>