import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios'

// Si hay token guardado, configurarlo en axios por defecto
const token = localStorage.getItem('modasoft_token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// Verificar token con el servidor al iniciar la app. Si el token no es válido
// (por ejemplo porque el servidor se reinició y usa un secret efímero), limpiar sesión.
if (token) {
	axios.get('http://localhost:3000/api/usuarios/me')
		.then(() => {
			// token válido
		})
		.catch(() => {
			// token inválido -> limpiar sesión local y redirigir a login
			localStorage.removeItem('modasoft_token')
			localStorage.removeItem('modasoft_user')
			delete axios.defaults.headers.common['Authorization']
			if (location.pathname !== '/Login') location.href = '/Login'
		})
}

const app = createApp(App)
app.use(router)
app.mount('#app')