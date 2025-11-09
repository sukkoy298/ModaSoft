import { createRouter, createWebHistory } from 'vue-router'

import Registro from '@/components/registroCliente.vue' 
import HomeView from '@/components/HomeView.vue'
import consultaCliente from '@/components/consultaCliente.vue'
import listaCliente from '@/components/listaCliente.vue'
import edicionCliente from '@/components/edicionCliente.vue'
import facturacion from '@/components/facturacion.vue'

// Mantener sólo rutas cuyos componentes estén realmente presentes
const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/registro', name: 'Registro', component: Registro },
  { path: '/consultaCliente', name: 'consultaCliente', component: consultaCliente },
  { path: '/listaCliente', name: 'listaCliente', component: listaCliente },
  { path: '/facturacion', name: 'facturacion', component: facturacion },
  { path: '/edicionCliente/:cedula', name: 'edicion-cliente', component: edicionCliente, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router