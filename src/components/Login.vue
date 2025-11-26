<script setup>
import Footer from '@/components/Footer.vue'; 
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const login = () => {
  if (username.value === '' || password.value === '') {
    errorMessage.value = 'Por favor, completa todos los campos';
    return;
  }

  fetch('http://localhost/api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      router.push('/dashboard'); // Redirige al módulo principal
    } else {
      errorMessage.value = 'Usuario o contraseña incorrectos';
    }
  })
  .catch(() => {
    errorMessage.value = 'Error de conexión con el servidor';
  });
};
</script>

<template>
  <div class="container mt-5 bg-body-tertiary">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm border-3 border-primary">
            <div class="card-body text-center d-flex flex-column justify-content-between">
              <div>
                <h5 class="card-title fw-bold text-primary">Iniciar Sesión</h5>
                <h6 class="card-subtitle mb-4 text-dark">Accede a tu cuenta</h6>
                <i class="bi bi-lock-fill fs-1 text-primary d-block mb-4"></i>
              </div>

              <form @submit.prevent="login" class="text-start">
                <div class="mb-3">
                  <label for="username" class="form-label fw-bold">Usuario</label>
                  <input type="text" id="username" v-model="username" class="form-control border-primary" placeholder="Ingresa tu usuario" />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label fw-bold">Contraseña</label>
                  <input type="password" id="password" v-model="password" class="form-control border-primary" placeholder="Ingresa tu contraseña" />
                </div>

                <div v-if="errorMessage" class="alert alert-danger p-2 text-center">
                  {{ errorMessage }}
                </div>

                <button type="submit" class="btn btn-outline-primary w-100 p-2 mt-3">
                  <i class="bi bi-box-arrow-in-right"></i> Entrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
