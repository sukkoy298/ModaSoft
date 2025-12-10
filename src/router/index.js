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
import Perfil from '@/components/Perfil.vue'

const routes = [
    {
        path: '/Login', 
        name: 'Login',
        component: Login
    },
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
        path: '/listaProducto',
        name: 'listaProducto',
        component: listaProducto,
        meta: { requiresAuth: true, roles: [1,3] }
    },
    {
        path: '/listaCliente',
        name: 'listaCliente',
        component: listaCliente,
        meta: { requiresAuth: true, roles: [1,2] }
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
        component: reportesGraficos,
        meta: { requiresAuth: true, roles: [1] }
    },
    {
        path: '/reportes-menu',
        name: 'reportesMenu',
        component: ReportesMenu,
        meta: { requiresAuth: true, roles: [1] }
    },
    {
        path: '/compras',
        name: 'compras',
        component: Compras,
        meta: { requiresAuth: true, roles: [1,3] }
    },
    {
        path: '/reportes-contables',
        name: 'reportes-contables',
        component: ReportesContables,
        meta: { requiresAuth: true, roles: [1] } // Solo Administrador
    },
    {
        path: '/proveedor',
        name: 'proveedor',
        component: ListaProveedores,
        meta: { requiresAuth: true, roles: [1,3] }
    },
    {
        path: '/proveedor/nuevo',
        name: 'proveedor-nuevo',
        component: ProveedorForm
    },
    {
        path: '/facturacion',
        name: 'facturacion',
        component: facturacion,
        meta: { requiresAuth: true, roles: [1,2] } // Administrador y Vendedor
    },
    {
        path: '/perfil',
        name: 'perfil',
        component: Perfil,
        meta: { requiresAuth: true }
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

// Guard global para rutas que requieran autenticación
import { getToken, getUser } from '@/auth.js'

router.beforeEach((to, from, next) => {
    // Allow public access only to Login and Registro
    if (to.name === 'Login' || to.name === 'Registro') return next()

    const token = getToken()
    if (!token) return next({ name: 'Login' })

    // si la ruta especifica roles, verificar rol del usuario
    if (to.meta?.roles && Array.isArray(to.meta.roles)) {
        const user = getUser()
        const idrol = user?.id_rol || user?.idRol || user?.idRol
        if (!idrol || !to.meta.roles.includes(Number(idrol))) {
            // no autorizado
            return next({ name: 'Home' })
        }
    }
    return next()
})

export default router