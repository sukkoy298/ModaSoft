import { createRouter, createWebHistory } from 'vue-router'

import Registro from '@/components/registroCliente.vue' 
import HomeView from '@/components/HomeView.vue'
import consultaCliente from '@/components/consultaCliente.vue'
import listaCliente from '@/components/listaCliente.vue'
import listaVentas from '@/components/listaVentas.vue'
import consultaVenta from '@/components/consultaVenta.vue'
import edicionVenta from '@/components/edicionVenta.vue'
import edicionCliente from '@/components/edicionCliente.vue'
import facturacion from '@/components/facturacion.vue'
// Importa los componentes que faltan o crea placeholders
import Reporte from '@/components/Reporte.vue'
import ListaProducto from '@/components/listaProducto.vue'
import Proveedor from '@/components/Proveedor.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/registro', name: 'Registro', component: Registro },
  { path: '/registroCliente', name: 'RegistroCliente', component: Registro },
  { path: '/consultaCliente', name: 'consultaCliente', component: consultaCliente },
  { path: '/listaCliente', name: 'listaCliente', component: listaCliente },
  { path: '/listaVentas', name: 'listaVentas', component: listaVentas },
  { path: '/consulta-ventas/:id_venta', name: 'consulta-venta', component: consultaVenta, props: true },
  { path: '/edicion-venta/:id_venta', name: 'edicion-venta', component: edicionVenta, props: true },
  { path: '/facturacion', name: 'facturacion', component: facturacion },
  { path: '/edicionCliente/:cedula', name: 'edicion-cliente', component: edicionCliente, props: true },
  
  // AGREGA ESTAS RUTAS FALTANTES
  { path: '/reporte', name: 'reporte', component: Reporte },
  { path: '/listaProducto', name: 'listaProducto', component: ListaProducto },
  { path: '/proveedor', name: 'proveedor', component: Proveedor }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router