<!-- src/views/ReportesView.vue -->
<template>
    <Header />
    <div class="container moda-main-container mt-5 mb-5">
        <!-- Título principal -->
        <div class="text-center mb-5">
            <h1 class="moda-title fw-bold">
                <i class="bi bi-clipboard-data moda-icon-danger me-2"></i> CENTRO DE REPORTES
            </h1>
            <p class="moda-subtitle lead">Selecciona el tipo de reporte que deseas visualizar</p>
        </div>

        <!-- Tarjetas de selección -->
        <div class="row g-4">

            <!-- Reportes de Clientes -->
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 moda-card shadow-lg hover-card" @click="navegarA('clientes')">
                    <div class="card-body text-center p-4 d-flex flex-column">
                        <div class="moda-card-icon bg-primary-moda mb-4">
                            <i class="bi bi-people-fill fs-1 text-white"></i>
                        </div>
                        <h4 class="card-title fw-bold mb-3 moda-title">Reportes de Clientes</h4>
                        <p class="card-text moda-subtitle mb-4 flex-grow-1">
                            Análisis de comportamiento, compras y segmentación de clientes.
                            Incluye filtros avanzados por fecha.
                        </p>
                        <div class="mt-3 mb-3">
                            <span class="badge badge-moda me-1">Top 10 Clientes</span>
                            <span class="badge moda-badge-secondary">Por Tipo</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top moda-card-footer text-center py-3">
                        <button class="btn btn-moda-primary">
                            <i class="bi bi-eye me-2"></i> Ver Reporte
                        </button>
                    </div>
                </div>
            </div>

            <!-- Reportes Gráficos -->
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 moda-card shadow-lg hover-card" @click="navegarA('graficos')">
                    <div class="card-body text-center p-4 d-flex flex-column">
                        <div class="moda-card-icon bg-accent-moda mb-4">
                            <i class="bi bi-bar-chart-fill fs-1 text-white"></i>
                        </div>
                        <h4 class="card-title fw-bold mb-3 moda-title">Reportes Gráficos</h4>
                        <p class="card-text moda-subtitle mb-4 flex-grow-1">
                            Visualización interactiva con gráficos.
                            Ventas, compras, productos más vendidos y proyecciones.
                        </p>
                        <div class="mt-3 mb-3">
                            <span class="badge badge-moda me-1">Gráficos</span>
                            <span class="badge moda-badge-warning">Proyecciones</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top moda-card-footer text-center py-3">
                        <button class="btn btn-moda-primary">
                            <i class="bi bi-bar-chart me-2"></i> Ver Gráficos
                        </button>
                    </div>
                </div>
            </div>

            <!-- Reportes de Ventas -->
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 moda-card shadow-lg hover-card" @click="navegarA('ventas')">
                    <div class="card-body text-center p-4 d-flex flex-column">
                        <div class="moda-card-icon bg-secondary-moda mb-4">
                            <i class="bi bi-cash-stack fs-1 text-white"></i>
                        </div>
                        <h4 class="card-title fw-bold mb-3 moda-title">Reportes de Ventas</h4>
                        <p class="card-text moda-subtitle mb-4 flex-grow-1">
                            Informes detallados de ventas, transacciones,
                            análisis de tendencias y rendimiento.
                        </p>
                        <div class="mt-3 mb-3">
                            <span class="badge badge-moda me-1">Ventas</span>
                            <span class="badge moda-badge-success">Tendencias</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top moda-card-footer text-center py-3">
                        <button class="btn btn-moda-primary">
                            <i class="bi bi-receipt me-2"></i> Ver Ventas
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navegarA = (tipo) => {
    switch (tipo) {
        case 'clientes':
            router.push('/reportes-clientes')
            break
        case 'graficos':
            router.push('/reportes-graficos')
            break
        case 'ventas':
            // Puedes crear esta vista después
            router.push('/reportes-ventas')
            break
    }
}
</script>

<style scoped>
/* Contenedor principal con estilo Moda */
.moda-main-container {
    background-color: #FFFDFB;
    border-radius: 14px;
    border: 1px solid #D6CFC8;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(74, 59, 52, 0.1);
    margin: 2rem auto;
}

/* Título principal */
.moda-title {
    color: #3A2E2A !important;
    font-weight: 700;
    font-size: 2rem;
    margin-bottom: 1rem;
}

.moda-icon-danger {
    color: #dc3545;
}

/* Subtítulo */
.moda-subtitle {
    color: #8B7355 !important;
    font-size: 1.1rem;
}

/* Tarjetas Moda */
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

.hover-card {
    cursor: pointer;
}

.moda-card-footer {
    border-color: #D6CFC8 !important;
    background-color: #F8F5F2 !important;
}

/* Iconos de tarjetas */
.moda-card-icon {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 4px 12px rgba(74, 59, 52, 0.2);
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

/* Botones */
.btn-moda-primary {
    background-color: #4A3B34 !important;
    border-color: #4A3B34 !important;
    color: white !important;
    border-radius: 8px;
    padding: 0.6rem 1.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-moda-primary:hover {
    background-color: #352822 !important;
    border-color: #352822 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 59, 52, 0.3);
}

/* Badges */
.badge-moda {
    background-color: #4A3B34 !important;
    color: white !important;
    border-radius: 20px;
    padding: 0.35em 0.85em;
    font-weight: 500;
}

.moda-badge-secondary {
    background-color: rgba(139, 115, 85, 0.15) !important;
    color: #8B7355 !important;
    border-radius: 20px;
    padding: 0.35em 0.85em;
    font-weight: 500;
}

.moda-badge-success {
    background-color: rgba(25, 135, 84, 0.15) !important;
    color: #198754 !important;
    border-radius: 20px;
    padding: 0.35em 0.85em;
    font-weight: 500;
}

.moda-badge-warning {
    background-color: rgba(255, 193, 7, 0.15) !important;
    color: #ffc107 !important;
    border-radius: 20px;
    padding: 0.35em 0.85em;
    font-weight: 500;
}

/* Estilos responsivos */
@media (max-width: 992px) {
    .moda-main-container {
        padding: 1.5rem;
    }
    
    .moda-title {
        font-size: 1.75rem;
    }
    
    .moda-card-icon {
        width: 80px;
        height: 80px;
    }
}

@media (max-width: 768px) {
    .moda-main-container {
        padding: 1rem;
        margin: 1rem auto;
    }
    
    .moda-title {
        font-size: 1.5rem;
    }
    
    .moda-card-icon {
        width: 70px;
        height: 70px;
    }
    
    .moda-card-icon i {
        font-size: 1.5rem !important;
    }
    
    .btn-moda-primary {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
}

@media (max-width: 576px) {
    .row {
        margin: 0 -0.5rem;
    }
    
    .col-lg-4, .col-md-6 {
        padding: 0.5rem;
    }
    
    .moda-card {
        margin-bottom: 1rem;
    }
}
</style>