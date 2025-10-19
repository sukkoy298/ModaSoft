<script setup>
import Header from '@/components/Header.vue'; 
</script>

<template>
    <Header />
    <div class="container mt-5">

        <div class="container py-4">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                
                <div class="col">
                    <div class="card h-100 shadow-sm border-success">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold text-success">Facturación en Caja</h5>
                                <h6 class="card-subtitle mb-4 text-body-secondary">Módulo de Venta Rápida</h6>

                                <i class="bi bi-cart-fill fs-1 text-success d-block mb-4"></i>
                            </div>
                            
                            <router-link to="/consultaCliente" class="btn btn-success">
                                <i class="bi bi-arrow-right-circle"></i> Realizar Venta
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="card h-100 shadow-sm border-danger">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold text-danger">Reportes y Análisis</h5>
                                <h6 class="card-subtitle mb-4 text-body-secondary">Consultar y Registrar</h6>

                                <i class="bi bi-bar-chart fs-1 text-danger d-block mb-4"></i>
                            </div>
                            
                            <router-link to="/Reportes" class="btn btn-danger text-white">
                                <i class="bi bi-flag"></i> Ver
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="card h-100 shadow-sm border-warning">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold text-warning">Inventario</h5>
                                <h6 class="card-subtitle mb-4 text-body-secondary">Control de Productos</h6>

                                <i class="bi bi-boxes fs-1 text-warning d-block mb-4"></i>
                            </div>
                            
                            <router-link to="/inventario" class="btn btn-warning text-dark">
                                <i class="bi bi-list-check"></i> Ir a Inventario
                            </router-link>
                        </div>
                    </div>
                </div>
                
                <div class="col">
                    <div class="card h-100 shadow-sm border-dark">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold text-dark">Clientes</h5>
                                <h6 class="card-subtitle mb-4 text-body-secondary">Gestión de Clientes</h6>

                                <i class="bi bi-person fs-1 text-dark d-block mb-4"></i>
                            </div>
                            
                            <router-link to="/listaCliente" class="btn btn-dark text-light">
                                <i class="bi bi-person-lines-fill"></i> Ver Clientes
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="card h-100 shadow-sm border-secondary">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold text-secondary">Proveedor</h5>
                                <h6 class="card-subtitle mb-4 text-body-secondary">Detalles del Proveedor</h6>

                                <i class="bi bi-clipboard-check fs-1 text-secondary d-block mb-4"></i>
                            </div>
                            
                            <router-link to="/Proveedores" class="btn btn-secondary text-light">
                                <i class="bi bi-box-seam"></i> Ver Proveedor
                            </router-link>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Las clases de Bootstrap ya manejan la mayor parte del diseño */
/* 'h-100' asegura que todas las tarjetas tengan la misma altura dentro de la fila */
</style>