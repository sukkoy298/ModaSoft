import { createRouter, createWebHistory } from 'vue-router'

// Importamos los componentes
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import Inventario from '../components/Inventario.vue'

const routes = [
    { path: '/', component: Dashboard },
    { path: '/login', component: Login },
    { path: '/inventario', component: Inventario },
]

const router = createRouter({
 history: createWebHistory(),
 routes
})

export default router