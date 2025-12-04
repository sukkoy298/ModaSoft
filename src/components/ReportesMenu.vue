<!-- src/views/ReportesView.vue -->
<template>
    <Header />
    <div class="container mt-5">
        <!-- Título principal -->
        <div class="text-center mb-5">
            <h1 class="display-5 fw-bold text-danger">
                <i class="bi bi-clipboard-data"></i> CENTRO DE REPORTES
            </h1>
            <p class="lead text-muted">Selecciona el tipo de reporte que deseas visualizar</p>
        </div>

        <!-- Tarjetas de selección -->
        <div class="row g-4">

            <!-- Reportes de Clientes -->
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 border-0 shadow-lg hover-card" @click="navegarA('clientes')">
                    <div class="card-body text-center p-4">
                        <div class="icon-container mb-3">
                            <i class="bi bi-people-fill text-primary fs-1"></i>
                        </div>
                        <h4 class="card-title fw-bold mb-3">Reportes de Clientes</h4>
                        <p class="card-text text-muted mb-4">
                            Análisis de comportamiento, compras y segmentación de clientes.
                            Incluye filtros avanzados por fecha.
                        </p>
                        <div class="mt-auto">
                            <span class="badge bg-primary">Top 10 Clientes</span>
                            <span class="badge bg-info ms-1">Por Tipo</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center py-3">
                        <button class="btn btn-primary">
                            <i class="bi bi-eye me-2"></i> Ver Reporte
                        </button>
                    </div>
                </div>
            </div>

            <!-- Reportes Gráficos -->
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 border-0 shadow-lg hover-card" @click="navegarA('graficos')">
                    <div class="card-body text-center p-4">
                        <div class="icon-container mb-3">
                            <i class="bi bi-bar-chart-fill text-success fs-1"></i>
                        </div>
                        <h4 class="card-title fw-bold mb-3">Reportes Gráficos</h4>
                        <p class="card-text text-muted mb-4">
                            Visualización interactiva con gráficos.
                            Ventas, compras, productos más vendidos y proyecciones.
                        </p>
                        <div class="mt-auto">
                            <span class="badge bg-success">Gráficos</span>
                            <span class="badge bg-warning ms-1">Proyecciones</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center py-3">
                        <button class="btn btn-success">
                            <i class="bi bi-bar-chart me-2"></i> Ver Gráficos
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
.hover-card {
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;
}

.hover-card:hover {
    transform: translateY(-10px);
    border-color: var(--bs-primary);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}

.icon-container {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 50%;
}
</style>