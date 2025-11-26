<template>

  <div class="moda-login-container d-flex justify-content-center align-items-center">
    <div class="moda-login-box shadow p-4 rounded">

      <img src="../images/Logo1.png" alt="Logo" class="logo align-items-center">

      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label">Nombre de usuario</label>
          <input v-model="username" type="text" class="form-control moda-input-custom" placeholder="Ingresa tu usuario">
        </div>

        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <input v-model="password" type="password" class="form-control moda-input-custom"
            placeholder="Ingresa tu contraseña">
        </div>

        <button class="btn btn-dark w-100 mb-3 moda-btn-login">
          Iniciar sesión
        </button>

        <div class="text-center">
          <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      console.log("Usuario:", this.username);
      console.log("Contraseña:", this.password);
    }
  }
};
</script>

<style scoped>
/* :root {
  --box-color: #FFFDFB;

  --text-dark: #3A2E2A;

  --button-dark: #4A3B34;

  --border-soft: #D6CFC8;
} */



.moda-login-container {
  background: radial-gradient(circle at center, #d1c5b9, #8B7355, #5D4A3A);
  height: 100vh;
}

.moda-login-box {
  background-color: #FFFDFB;
  width: 380px;
  border: 1px solid #D6CFC8;
  border-radius: 14px;
}

.logo {
  height: 150px;
  width: auto;
  margin-left: 80px;
}

.modaa-title {
  color: #3A2E2A;
  font-weight: 700;
}

.moda-input-custom {
  border-radius: 10px;
  border: 1px solid #D6CFC8;
  background-color: #fff;
}

.moda-btn-login {
  color: #fff !important;
  background-color: #4A3B34;
  border-radius: 10px;
}

.moda-btn-login:hover {
  background-color: #352822;
}

.forgot-link {
  color: #4A3B34;
  text-decoration: none;
  font-size: 15px;
}

.forgot-link:hover {
  text-decoration: underline;
}
</style>