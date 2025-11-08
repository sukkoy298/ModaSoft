import { createApp } from 'vue'
import App from './App.vue'
<<<<<<< HEAD

// importar bootstrap CSS y bundle JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).mount('#app')
=======
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App)
app.use(router)
app.mount('#app')
>>>>>>> origin/Clientes
