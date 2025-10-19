import { createRouter, createWebHistory } from 'vue-router'

import Registro from '@/components/registroCliente.vue' 
import HomeView from '@/components/HomeView.vue'
import consultaCliente from '@/components/consultaCliente.vue'
import listaCliente from '@/components/listaCliente.vue'

const routes = [
    {
        path: '/', 
        name: 'Home',
        component: HomeView
    },
    {
        path: '/registro',
        name: 'Registro',
        component: Registro
    },
    {
        path: '/consultaCliente',
        name: 'consultaCliente',
        component: consultaCliente
    },
    {
        path: '/listaCliente',
        name: 'listaCliente',
        component: listaCliente
    },
]

const router = createRouter({
  history: createWebHistory(), 
  routes
})

export default router