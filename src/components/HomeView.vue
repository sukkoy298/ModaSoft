<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue'; 
</script>

<template>
    <Header />
    <div class="container mt-5 bg-body-tertiary">

        <div class="container py-4">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">

                <div class="col">
                    <div class="card h-100 shadow-sm border-3 border-info">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold text-info">Facturación en Caja</h5>
                                <h6 class="card-subtitle mb-4 text-dark">Módulo de Venta Rápida</h6>

                                <i class="bi bi-cart-fill fs-1 text-info d-block mb-4"></i>
                            </div>

                            <router-link to="/consultaCliente" class="btn btn-outline-info text-dark w-50 mx-auto p-2">
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
                                <h6 class="card-subtitle mb-4 text-dark">Consultar y Registrar</h6>

                                <i class="bi bi-bar-chart fs-1 text-danger d-block mb-4"></i>
                            </div>

                            <router-link to="/reporte" class="btn btn-outline-danger w-50 mx-auto p-2">
                                <i class="bi bi-flag"></i> Ver Reportes
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="card h-100 shadow-sm border-warning">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold text-warning">Inventario</h5>
                                <h6 class="card-subtitle mb-4 text-dark">Control de Productos</h6>

                                <i class="bi bi-boxes fs-1 text-warning d-block mb-4"></i>
                            </div>

                            <router-link to="/listaProducto" class="btn btn-outline-warning text-dark w-50 mx-auto p-2">
                                <i class="bi bi-list-check"></i> Ir a Inventario
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="card h-100 shadow-sm border-3 border-dark">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold text-dark">Clientes</h5>
                                <h6 class="card-subtitle mb-4 text-secondary">Gestión de Clientes</h6>

                                <i class="bi bi-person fs-1 text-dark d-block mb-4"></i>
                            </div>

                            <router-link to="/listaCliente" class="btn btn-outline-dark w-50 mx-auto p-2">
                                <i class="bi bi-person-lines-fill"></i> Ver Clientes
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="card h-100 shadow-sm border-3 border-secondary">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold text-dark">Proveedor</h5>
                                <h6 class="card-subtitle mb-4 text-secondary">Detalles del Proveedor</h6>

                                <i class="bi bi-person-vcard-fill fs-1 text-secondary d-block mb-4"></i>
                            </div>

                            <router-link to="/proveedor" class="btn btn-outline-secondary w-50 mx-auto p-2">
                                <i class="bi bi-box-seam"></i> Ver Proveedor
                            </router-link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <Footer />
</template>