import { createRouter, createWebHistory } from 'vue-router'

// Importamos los componentes
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import Clientes from '../components/Clientes.vue'
import Inventario from '../components/Inventario.vue'
import Reportes from '../components/Reportes.vue'
import Ventas from '../components/Ventas.vue'

const routes = [
 { path: '/', component: Dashboard },
 { path: '/login', component: Login },
 { path: '/clientes', component: Clientes },
 { path: '/inventario', component: Inventario },
 { path: '/reportes', component: Reportes },
 { path: '/ventas', component: Ventas },
]

const router = createRouter({
 history: createWebHistory(),
 routes
})

export default router