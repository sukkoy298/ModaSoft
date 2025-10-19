import { createRouter, createWebHistory } from 'vue-router'

import Registro from '@/components/registroCliente.vue' 
import HomeView from '@/components/HomeView.vue'
import consultaCliente from '@/components/consultaCliente.vue'
import listaCliente from '@/components/listaCliente.vue'
import Proveedores from '@/components/Proveedores.vue'
import Reportes from '@/components/Reportes.vue'

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
    {
        path: '/Proveedores',
        name: 'Proveedores',
        component: Proveedores  
    },
    {
        path: '/Reportes',
        name: 'Reportes',
        component: Reportes  
    },
]

const router = createRouter({
  history: createWebHistory(), 
  routes
})

export default router