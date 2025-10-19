<template lang="">
<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-3">
    <div class="container-fluid">
        <a class="navbar-brand text-uppercase fw-bold fs-4 ms-3" href="#">
            <span class="text-secondary me-1">MODA</span>SOFT
        </a>

        <button 
            class="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#modasoftNavbar" 
            aria-controls="modasoftNavbar" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="modasoftNavbar">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item me-4">
                    <a class="nav-link text-dark fw-semibold" aria-current="page" href="#">Inicio</a>
                </li>
                <li class="nav-item me-4">
                    <a class="nav-link text-dark fw-semibold active" href="#">Inventario</a>
                </li>
                <li class="nav-item me-4">
                    <a class="nav-link text-dark fw-semibold" href="#">Ventas</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark fw-semibold" href="#">Reportes</a>
                </li>
            </ul>

            <div class="d-flex align-items-center me-3">
                <button class="btn btn-link text-dark me-3 p-0" aria-label="Buscar producto">
                    <i class="bi bi-search fs-5"></i>
                </button>
                
                <button class="btn btn-link text-dark me-3 p-0" aria-label="Perfil de usuario">
                    <i class="bi bi-person-circle fs-5"></i>
                </button>

                <button class="btn btn-link text-dark p-0" aria-label="Opciones">
                    <i class="bi bi-gear-fill fs-5"></i>
                </button>
            </div>
        </div>
    </div>
</nav>
</template>

<script>
export default {
    
}
</script>