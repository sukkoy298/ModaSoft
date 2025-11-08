<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand fw-bold text-primary">
                <img src="../images/WhatsApp Image 2025-10-18 at 3.31.58 PM.jpeg" alt="Moda Soft" class="app-logo" />
            </router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavDropdown">

                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="bi bi-plus-circle"></i> Ver más
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <router-link to="/ayuda" class="dropdown-item">
                                    <i class="bi bi-patch-question"></i> Ayuda y Soporte
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/listaCliente" class="dropdown-item">
                                    <i class="bi bi-emoji-sunglasses"></i> Clientes
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link to="/login" class="btn btn-outline-success me-2">
                            <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/perfil" class="nav-link">
                            <i class="bi bi-person-circle fs-5"></i>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.app-logo {
    height: 64px;
    width: auto;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
</style>