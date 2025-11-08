import { createRouter, createWebHistory } from 'vue-router'

import Registro from '@/components/registroCliente.vue' 
import HomeView from '@/components/HomeView.vue'
import consultaCliente from '@/components/consultaCliente.vue'
import listaCliente from '@/components/listaCliente.vue'
import edicionCliente from '@/components/edicionCliente.vue' 
import listaProducto from '@/components/listaProducto.vue';
import registroProducto from '@/components/registroProducto.vue'; 
import registroVarianteProducto from '@/components/registroVarianteProducto.vue';
import registroCategoria from '@/components/registroCategoria.vue';
import registroMarca from '@/components/registroMarca.vue';

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
        path: '/listaProducto',
        name: 'listaProducto',
        component: listaProducto
    },
    {
        path: '/listaCliente',
        name: 'listaCliente',
        component: listaCliente
    },
    {
        path: '/edicionCliente/:cedula',
        name: 'edicion-cliente',
        component: edicionCliente,
        props: true
    },
    {
        path: '/registroProducto', 
        name: 'registroProducto', 
        component: registroProducto 
    },
    {
        path: '/registroVarianteProducto', 
        name: 'registroVarianteProducto', 
        component: registroVarianteProducto 
    },
    {
        path: '/registroCategoria', 
        name: 'registroCategoria', 
        component: registroCategoria 
    },
    {
        path: '/registroMarca', 
        name: 'registroMarca', 
        component: registroMarca 
    },
]

const router = createRouter({
    history: createWebHistory(), 
    routes
})

export default router