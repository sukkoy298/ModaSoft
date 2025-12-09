import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/Login.vue'
import Registro from '@/components/registroCliente.vue' 
import HomeView from '@/components/HomeView.vue'
import listaCliente from '@/components/listaCliente.vue'
import facturacion from '@/components/facturacion.vue'
import edicionCliente from '@/components/edicionCliente.vue' 
import listaProducto from '@/components/listaProducto.vue';
import registroProducto from '@/components/registroProducto.vue'; 
import registroVarianteProducto from '@/components/registroVarianteProducto.vue';
import registroCategoria from '@/components/registroCategoria.vue';
import registroMarca from '@/components/registroMarca.vue';
import reportesClientes from '@/components/reportesClientes.vue';
import reportesGraficos from '@/components/reportesGraficos.vue';
import ReportesMenu from '@/components/ReportesMenu.vue'
import Compras from '@/components/Compras.vue'
import ReportesContables from '@/components/ReportesContables.vue'
import ListaProveedores from '@/components/ListaProveedores.vue'
import ProveedorForm from '@/components/ProveedorForm.vue'
import EdicionProveedor from '../components/edicionProveedor.vue'

const routes = [
    {
        path: '/', 
        name: 'Home',
        component: HomeView
    },
    {
        path: '/Login', 
        name: 'Login',
        component: Login
    },
    {
        path: '/registro',
        name: 'Registro',
        component: Registro
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
    {
        path: '/reportes-clientes',
        name: 'reportesClientes',
        component: reportesClientes
    },
    {
        path: '/reportes-graficos',
        name: 'reportesGraficos',
        component: reportesGraficos
    },
    {
        path: '/reportes-menu',
        name: 'reportesMenu',
        component: ReportesMenu
    },
    {
        path: '/compras',
        name: 'compras',
        component: Compras
    },
    {
        path: '/reportes-contables',
        name: 'reportes-contables',
        component: ReportesContables
    },
    {
        path: '/proveedor',
        name: 'proveedor',
        component: ListaProveedores
    },
    {
        path: '/proveedor/nuevo',
        name: 'proveedor-nuevo',
        component: ProveedorForm
    },
    {
        path: '/facturacion',
        name: 'facturacion',
        component: facturacion
    },
    {
        path: '/proveedor/editar/:doc_identidad',
        name: 'edicion-proveedor',
        component: EdicionProveedor
    }
]

const router = createRouter({
    history: createWebHistory(), 
    routes
})

export default router