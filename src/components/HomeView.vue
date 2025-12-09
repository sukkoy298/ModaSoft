<template>
    <Header />
    <div class="container mt-5 mb-5">

        <div class="container py-4">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                
                <!-- Facturación -->
                <div class="col">
                    <div class="card h-100 moda-card shadow-lg">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <div class="moda-card-icon bg-primary-moda">
                                    <i class="bi bi-cart-fill fs-1"></i>
                                </div>
                                <h5 class="card-title fw-bold mt-3 moda-title">Facturación en Caja</h5>
                                <h6 class="card-subtitle mb-4 moda-subtitle">Módulo de Venta Rápida</h6>
                            </div>
                            
                            <router-link to="/facturacion" class="btn btn-moda-primary w-50 mx-auto p-2">
                                <i class="bi bi-arrow-right-circle me-2"></i> Realizar Venta
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Reportes -->
                <div class="col">
                    <div class="card h-100 moda-card shadow-lg">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <div class="moda-card-icon bg-secondary-moda">
                                    <i class="bi bi-bar-chart fs-1"></i>
                                </div>
                                <h5 class="card-title fw-bold mt-3 moda-title">Reportes y Análisis</h5>
                                <h6 class="card-subtitle mb-4 moda-subtitle">Consultar y Registrar</h6>
                            </div>
                            
                            <router-link to="/reportes-menu" class="btn btn-moda-outline w-50 mx-auto p-2">
                                <i class="bi bi-flag me-2"></i> Ver Reportes
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Inventario -->
                <div class="col">
                    <div class="card h-100 moda-card shadow-lg">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <div class="moda-card-icon bg-accent-moda">
                                    <i class="bi bi-boxes fs-1"></i>
                                </div>
                                <h5 class="card-title fw-bold mt-3 moda-title">Inventario</h5>
                                <h6 class="card-subtitle mb-4 moda-subtitle">Control de Productos</h6>
                            </div>
                            
                            <router-link to="/listaProducto" class="btn btn-moda-primary w-50 mx-auto p-2">
                                <i class="bi bi-list-check me-2"></i> Ir a Inventario
                            </router-link>
                            <router-link to="/compras" class="btn btn-moda-outline mt-2 w-50 mx-auto p-2">
                                <i class="bi bi-bag-plus me-2"></i> Comprar Productos
                            </router-link>
                        </div>
                    </div>
                </div>
                
                <!-- Clientes -->
                <div class="col">
                    <div class="card h-100 moda-card shadow-lg">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <div class="moda-card-icon bg-dark-moda">
                                    <i class="bi bi-person fs-1"></i>
                                </div>
                                <h5 class="card-title fw-bold mt-3 moda-title">Clientes</h5>
                                <h6 class="card-subtitle mb-4 moda-subtitle">Gestión de Clientes</h6>
                            </div>
                            
                            <router-link to="/listaCliente" class="btn btn-moda-outline w-50 mx-auto p-2">
                                <i class="bi bi-person-lines-fill me-2"></i> Ver Clientes
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Proveedor -->
                <div class="col">
                    <div class="card h-100 moda-card shadow-lg">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                                <div class="moda-card-icon bg-light-moda">
                                    <i class="bi bi-person-vcard-fill fs-1"></i>
                                </div>
                                <h5 class="card-title fw-bold mt-3 moda-title">Proveedor</h5>
                                <h6 class="card-subtitle mb-4 moda-subtitle">Gestión de Proveedores</h6>
                            </div>
                            
                            <router-link to="/proveedor" class="btn btn-moda-primary w-50 mx-auto p-2">
                                <i class="bi bi-box-seam me-2"></i> Ver Proveedor
                            </router-link>
                            <router-link to="/reportes-contables" class="btn btn-moda-outline mt-2 w-50 mx-auto p-2">
                                <i class="bi bi-journal-text me-2"></i> Contabilidad
                            </router-link>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import Header from '@/components/Header.vue'; 
import Footer from '@/components/Footer.vue'; 
</script>

<style scoped>
/* Estilos específicos para este componente */

.container {
    background-color: rgba(255, 253, 251, 0.95);
    border-radius: 14px;
    border: 1px solid #D6CFC8;
    margin-top: 2rem !important;
    padding: 2rem;
}

.moda-card {
    background-color: #FFFDFB !important;
    border: 2px solid #D6CFC8 !important;
    border-radius: 12px !important;
    transition: all 0.3s ease;
}

.moda-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(74, 59, 52, 0.2) !important;
    border-color: #8B7355 !important;
}

.moda-card-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    color: white;
}

.bg-primary-moda {
    background: linear-gradient(135deg, #4A3B34, #5D4A3A);
}

.bg-secondary-moda {
    background: linear-gradient(135deg, #8B7355, #A99276);
}

.bg-accent-moda {
    background: linear-gradient(135deg, #5D4A3A, #8B7355);
}

.bg-dark-moda {
    background: linear-gradient(135deg, #3A2E2A, #4A3B34);
}

.bg-light-moda {
    background: linear-gradient(135deg, #D6CFC8, #B8A99C);
    color: #3A2E2A !important;
}

.bg-light-moda i {
    color: #3A2E2A !important;
}

.moda-title {
    color: #3A2E2A !important;
    font-size: 1.25rem;
}

.moda-subtitle {
    color: #8B7355 !important;
    font-size: 0.9rem;
}

.btn-moda-primary {
    background-color: #4A3B34 !important;
    border-color: #4A3B34 !important;
    color: white !important;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-moda-primary:hover {
    background-color: #352822 !important;
    border-color: #352822 !important;
    transform: translateY(-2px);
}

.btn-moda-outline {
    background-color: transparent !important;
    border: 2px solid #4A3B34 !important;
    color: #4A3B34 !important;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-moda-outline:hover {
    background-color: #4A3B34 !important;
    color: white !important;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
        margin-top: 1rem !important;
    }
    
    .moda-card-icon {
        width: 60px;
        height: 60px;
    }
    
    .moda-card-icon i {
        font-size: 1.5rem !important;
    }
}
</style>