<template>
    <nav class="navbar navbar-expand-lg navbar-moda-simple">
        <div class="container">
            <!-- Logo y nombre -->
            <router-link to="/" class="navbar-brand d-flex align-items-center">
                <div class="moda-logo-simple">
                    <img src="../images/WhatsApp Image 2025-10-18 at 3.31.58 PM.jpeg" 
                         alt="Moda Soft" 
                         class="logo" />
                </div>
                <span class="ms-2 brand-text">Moda Soft</span>
            </router-link>

            <!-- Menú móvil -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Contenido -->
            <div class="collapse navbar-collapse" id="navbarMenu">
                <!-- Navegación -->
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link" active-class="active">
                            <i class="bi bi-house"></i> Inicio
                        </router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            <i class="bi bi-menu-button-wide"></i> Módulos
                        </a>
                        <ul class="dropdown-menu moda-dropdown">
                            <!-- Vendedor y Admin pueden facturar -->
                            <li v-if="user && (isAdmin || isVendedor)"><router-link to="/facturacion" class="dropdown-item moda-dropdown-item">Facturación</router-link></li>
                            <!-- Inventario visible para Almacén y Admin -->
                            <li v-if="user && (isAdmin || isAlmacen)"><router-link to="/listaProducto" class="dropdown-item moda-dropdown-item">Inventario</router-link></li>
                            <!-- Clientes visible para Vendedor y Admin -->
                            <li v-if="user && (isAdmin || isVendedor)"><router-link to="/listaCliente" class="dropdown-item moda-dropdown-item">Clientes</router-link></li>
                            <!-- Reportes sólo Admin -->
                            <li v-if="user && isAdmin"><router-link to="/reportes-menu" class="dropdown-item moda-dropdown-item">Reportes</router-link></li>
                            <!-- Proveedores y Compras para Almacén y Admin -->
                            <li v-if="user && (isAdmin || isAlmacen)"><router-link to="/proveedor" class="dropdown-item moda-dropdown-item">Proveedores</router-link></li>
                            <li v-if="user && (isAdmin || isAlmacen)"><router-link to="/compras" class="dropdown-item moda-dropdown-item">Compras</router-link></li>
                            <!-- Contable sólo Admin -->
                            <li v-if="user && isAdmin"><router-link to="/reportes-contables" class="dropdown-item moda-dropdown-item">Contable</router-link></li>
                        </ul>
                    </li>
                </ul>

                <!-- Usuario -->
                <div class="navbar-nav">
                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" data-bs-toggle="dropdown">
                            <div class="user-avatar me-2">
                                <i class="bi bi-person"></i>
                            </div>
                            <span>{{ user?.usuario || 'Invitado' }}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end moda-dropdown">
                            <li><router-link v-if="user" to="/perfil" class="dropdown-item moda-dropdown-item">Perfil</router-link></li>
                            <li v-if="user && isAdmin"><router-link to="/reportes-menu" class="dropdown-item moda-dropdown-item">Reportes</router-link></li>
                            <li><hr class="dropdown-divider moda-divider"></li>
                            <li v-if="user"><a class="dropdown-item moda-dropdown-item text-danger" href="#" @click.prevent="doLogout">Cerrar Sesión</a></li>
                            <li v-else><router-link to="/login" class="dropdown-item moda-dropdown-item">Iniciar Sesión</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
/* Navbar simple - ARREGLO ESPECÍFICO PARA DROPDOWNS */
.navbar-moda-simple {
    background-color: #FFFDFB;
    border-bottom: 1px solid #D6CFC8;
    padding: 0.5rem 0;
}

/* Logo */
.moda-logo-simple {
    background: white;
    padding: 4px;
    border-radius: 8px;
    border: 1px solid #D6CFC8;
}

.logo {
    height: 40px;
    width: auto;
    border-radius: 6px;
}

.brand-text {
    color: #4A3B34;
    font-weight: 700;
    font-size: 1.3rem;
}

/* Enlaces */
.nav-link {
    color: #3A2E2A !important;
    padding: 0.5rem 1rem !important;
    border-radius: 6px;
    margin: 0 0.125rem;
}

.nav-link:hover,
.nav-link.active {
    background-color: #4A3B34 !important;
    color: white !important;
}

/* DROPDOWN FIX - ESTO ES LO QUE NECESITAS */
.navbar .dropdown-menu.moda-dropdown {
    background-color: #FFFDFB !important; /* Fuerza el color de fondo */
    border: 1px solid #D6CFC8 !important; /* Fuerza el borde */
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(74, 59, 52, 0.1) !important;
    margin-top: 0.5rem !important; /* Asegura separación */
    padding: 0.5rem 0 !important;
}

/* Items del dropdown */
.navbar .dropdown-item.moda-dropdown-item {
    color: #3A2E2A !important;
    padding: 0.5rem 1rem !important;
    border-radius: 4px !important;
    margin: 0.125rem 0.5rem !important;
    width: auto !important; /* Evita que se expanda */
    min-width: 180px !important; /* Ancho mínimo */
}

.navbar .dropdown-item.moda-dropdown-item:hover {
    background-color: #4A3B34 !important;
    color: white !important;
}

/* Divider personalizado */
.navbar .dropdown-divider.moda-divider {
    border-color: #D6CFC8 !important;
    margin: 0.5rem 0 !important;
}

/* FIX para los colores de texto en hover */
.navbar .dropdown-item.moda-dropdown-item:hover,
.navbar .dropdown-item.moda-dropdown-item:hover * {
    color: white !important;
}

/* FIX específico para enlaces dentro de dropdown */
.navbar .dropdown-item.moda-dropdown-item.router-link-active {
    background-color: rgba(74, 59, 52, 0.1) !important;
    color: #4A3B34 !important;
}

/* Avatar */
.user-avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #4A3B34, #5D4A3A);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
}

/* Responsive - IMPORTANTE mantener los estilos */
@media (max-width: 992px) {
    .navbar-nav {
        margin-top: 0.5rem;
    }
    
    .nav-link {
        margin: 0.125rem 0;
    }
    
    /* Dropdown en móvil */
    .navbar .dropdown-menu.moda-dropdown {
        background-color: rgba(255, 253, 251, 0.95) !important;
        border: none !important;
        box-shadow: none !important;
        padding-left: 1rem !important;
    }
}

/* FIX para cuando el dropdown está abierto */
.show .dropdown-menu.moda-dropdown {
    display: block !important;
    opacity: 1 !important;
    transform: translateY(0) !important;
}
</style>

<script setup>
import { getUser, logout } from '@/auth.js'
import { useRouter } from 'vue-router'

const user = getUser()
const isAdmin = user?.id_rol === 1
const isVendedor = user?.id_rol === 2
const isAlmacen = user?.id_rol === 3
const router = useRouter()

function doLogout() {
    logout()
    router.push('/Login')
}
</script>