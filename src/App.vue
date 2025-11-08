<script setup>
<<<<<<< HEAD
import SalesView from './views/SalesView.vue'
</script>

<template>
  <div id="app">
    <SalesView />
  </div>
</template>

<style>
/* ESTILOS GLOBALES - ESTOS SE APLICARÁN A TODA LA APLICACIÓN */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  width: 100%;
}

/* Estilos para inputs y botones globales */
input, button {
  font-family: inherit;
  font-size: inherit;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  transition: background 0.2s;
}

button:hover {
  background: #0056b3;
}

input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

/* Contenedor principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}
</style>
=======
  
</script>

<template>
  <div>
    <router-view />
 </div>
</template>

<style scoped>

</style>
>>>>>>> origin/Clientes
