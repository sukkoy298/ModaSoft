<script setup>
import { ref } from 'vue';

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement, LinearScale, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'vue-chartjs'; 

import Header from '@/components/Header.vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement, LinearScale, LineElement, PointElement);

const activeReport = ref(null); 
const chartData = ref(null);   
const chartOptions = ref({});  

const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            font: {
                size: 16,
                weight: 'bold',
            }
        }
    }
};

const mockSalesData = {
    dailySales: 50,
    weeklySales: 280,
    monthlySales: 1100,
};

const mockPurchasesData = [
    { name: 'Suministros Tech S.A.', cantidad: 4500 },
    { name: 'Moda Express C.A.', cantidad: 2800 },
    { name: 'Distribuidora Fénix', cantidad: 1500 },
    { name: 'Materiales Globales', cantidad: 900 },
];

const mockProductsData = [
    { name: 'T-shirt Logo', cantidad: 750 },
    { name: 'Chaqueta Ligera', cantidad: 420 },
    { name: 'Pantalón negro', cantidad: 610 },
    { name: 'Shorts playero', cantidad: 380 },
];

const projectionData = {
    historicalSales: [1200, 1350, 1500, 1450, 1600, 1750], 
    historicalMonths: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    baseGrowthRate: 0.05, 
    safetyStockMultiplier: 1.10, 
};

const loadSalesReports = () => {
    chartOptions.value = {
        ...baseChartOptions,
        plugins: {
            ...baseChartOptions.plugins,
            title: {
                ...baseChartOptions.plugins.title,
                text: 'Distribución de Ventas por Período (Prendas Vendidas)',
            }
        }
    };

    const dataValues = [
        mockSalesData.dailySales,
        mockSalesData.weeklySales,
        mockSalesData.monthlySales
    ];

    chartData.value = {
        labels: ['Ventas Diarias', 'Ventas Semanales', 'Ventas Mensuales'],
        datasets: [
            {
                backgroundColor: ['#0d6efd', '#20c997', '#ffc107'], 
                data: dataValues,
                hoverOffset: 8,
            }
        ]
    };
    
    activeReport.value = 'sales';
};

const loadPurchasesReports = () => {
    const sortedData = mockPurchasesData.sort((a, b) => b.cantidad - a.cantidad);
    const labels = sortedData.map(d => d.name);
    const dataValues = sortedData.map(d => d.cantidad);

    chartOptions.value = {
        ...baseChartOptions,
        indexAxis: 'x', 
        plugins: {
            ...baseChartOptions.plugins,
            legend: { display: false }, 
            title: {
                ...baseChartOptions.plugins.title,
                text: 'Top Compras a Proveedores (Prendas, Último Mes)',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad de Prendas Compradas',
                    font: { weight: 'bold' }
                }
            },
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    chartData.value = {
        labels: labels,
        datasets: [
            {
                label: 'Prendas Compradas',
                backgroundColor: '#dc3545', 
                data: dataValues,
                borderRadius: 5,
                borderSkipped: false,
            }
        ]
    };
    
    activeReport.value = 'purchases';
};

const loadProductsReports = () => {
    const sortedData = mockProductsData.sort((a, b) => b.cantidad - a.cantidad);
    const labels = sortedData.map(d => d.name);
    const dataValues = sortedData.map(d => d.cantidad);

    chartOptions.value = {
        ...baseChartOptions,
        indexAxis: 'y', 
        plugins: {
            ...baseChartOptions.plugins,
            legend: { display: false }, 
            title: {
                ...baseChartOptions.plugins.title,
                text: 'Top Productos Más Vendidos (Prendas, Último Mes)',
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad de Prendas Vendidas',
                    font: { weight: 'bold' }
                }
            },
            y: {}
        }
    };

    chartData.value = {
        labels: labels,
        datasets: [
            {
                label: 'Prendas Vendidas',
                backgroundColor: '#198754', 
                data: dataValues,
                borderRadius: 5,
                borderSkipped: false,
            }
        ]
    };
    
    activeReport.value = 'products';
};

const loadProjectionReports = () => {

    const salesLabels = [...projectionData.historicalMonths, 'Ene (P)', 'Feb (P)', 'Mar (P)'];

    const totalSales = projectionData.historicalSales.reduce((sum, val) => sum + val, 0);
    const avgSales = totalSales / projectionData.historicalSales.length;
    
    let projectedSales = [];
    let lastValue = avgSales; 
    for (let i = 0; i < 3; i++) {
        lastValue = lastValue * (1 + projectionData.baseGrowthRate);
        projectedSales.push(Math.round(lastValue));
    }

    const salesDataset = {
        labels: salesLabels,
        datasets: [
            {
                type: 'line',
                label: 'Ventas Históricas',
                data: projectionData.historicalSales,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.2)',
                fill: false,
                tension: 0.3
            },
            {
                type: 'line',
                label: 'Ventas Proyectadas',
                data: Array(projectionData.historicalMonths.length).fill(null).concat(projectedSales), 
                borderColor: '#20c997',
                backgroundColor: 'rgba(32, 201, 151, 0.4)',
                borderDash: [5, 5],
                fill: false,
                tension: 0.3
            }
        ]
    };
    const salesOptions = {
        ...baseChartOptions,
        plugins: {
            ...baseChartOptions.plugins,
            title: { ...baseChartOptions.plugins.title, text: '1. Proyección de Ventas Mensuales (Próximo Trimestre)' }
        },
        scales: {
            y: { beginAtZero: false, title: { display: true, text: 'Cantidad de Prendas' } }
        }
    };

    const projectedProducts = mockProductsData.map(p => ({
        name: p.name,
        cantidad: Math.round(p.cantidad * (1 + projectionData.baseGrowthRate)) 
    }));
    const productLabels = projectedProducts.map(p => p.name);
    const productDataValues = projectedProducts.map(p => p.cantidad);

    const productDataset = {
        labels: productLabels,
        datasets: [
            {
                label: 'Proyección de Venta de Productos',
                data: productDataValues,
                backgroundColor: ['#0d6efd', '#ffc107', '#20c997', '#dc3545'], // Colores distintos
                borderRadius: 5,
            }
        ]
    };
    const productOptions = {
        ...baseChartOptions,
        indexAxis: 'y', 
        plugins: {
            ...baseChartOptions.plugins,
            legend: { display: false },
            title: { ...baseChartOptions.plugins.title, text: '2. Proyección de Venta por Producto (Próximo Mes)' }
        },
        scales: {
            x: { beginAtZero: true, title: { display: true, text: 'Cantidad Proyectada (Prendas)' } }
        }
    };

    const projectedPurchases = projectedProducts.map(p => ({
        name: p.name,
        cantidad: Math.round(p.cantidad * projectionData.safetyStockMultiplier)
    }));
    const purchaseLabels = projectedPurchases.map(p => p.name);
    const purchaseDataValues = projectedPurchases.map(p => p.cantidad);

    const purchaseDataset = {
        labels: purchaseLabels,
        datasets: [
            {
                label: 'Proyección de Compras Necesarias',
                data: purchaseDataValues,
                backgroundColor: '#6f42c1', 
                borderRadius: 5,
            }
        ]
    };
    const purchaseOptions = {
        ...baseChartOptions,
        indexAxis: 'y',
        plugins: {
            ...baseChartOptions.plugins,
            legend: { display: false },
            title: { ...baseChartOptions.plugins.title, text: '3. Proyección de Compras a Proveedores (Necesidades de Stock)' }
        },
        scales: {
            x: { beginAtZero: true, title: { display: true, text: 'Cantidad Proyectada a Comprar (Prendas)' } }
        }
    };

    chartData.value = {
        salesProjection: salesDataset,
        productProjection: productDataset,
        purchaseProjection: purchaseDataset,
    };
    
    chartOptions.value = {
        salesProjection: salesOptions,
        productProjection: productOptions,
        purchaseProjection: purchaseOptions,
    };

    activeReport.value = 'projection';
};


const handleReportClick = (reportKey) => {
    if (activeReport.value === reportKey) {
        activeReport.value = null;
        chartData.value = null;
        chartOptions.value = {};
    } else {
        chartData.value = null;
        chartOptions.value = {};

        if (reportKey === 'sales') {
            loadSalesReports();
        } else if (reportKey === 'purchases') {
            loadPurchasesReports(); 
        } else if (reportKey === 'products') {
            loadProductsReports(); 
        } else if (reportKey === 'projection') {
            loadProjectionReports(); 
        }
        else {
            activeReport.value = reportKey;
        }
    }
}
</script>

<template>
    <Header />
    
    <div class="bg-white m-4 p-4 rounded-3 border shadow-sm">
        <div class="text-center mt-3 mb-4">
            <label class="h3 text-primary">Reportes y Análisis</label>
        </div>
        
        <div class="row g-2 mb-4">
            
            <!-- Reporte de Ventas -->
            <div class="col-12 col-md-3">
                <button 
                    @click="handleReportClick('sales')"
                    :class="{'btn-primary': activeReport === 'sales', 'btn-outline-primary': activeReport !== 'sales'}"
                    class="btn w-100 fw-bold"
                >
                    <i class="bi bi-cash-coin"></i> Reporte de Ventas
                </button>
            </div>
            
            <!-- Reportes de Compras a Proveedores -->
            <div class="col-12 col-md-3">
                <button 
                    @click="handleReportClick('purchases')"
                    :class="{'btn-primary': activeReport === 'purchases', 'btn-outline-primary': activeReport !== 'purchases'}"
                    class="btn w-100 fw-bold"
                >
                    <i class="bi bi-shop"></i> Reportes de Compras a Proveedores
                </button>
            </div>
            
            <!-- Reporte de Productos más Vendidos -->
            <div class="col-12 col-md-3">
                <button 
                    @click="handleReportClick('products')"
                    :class="{'btn-primary': activeReport === 'products', 'btn-outline-primary': activeReport !== 'products'}"
                    class="btn w-100 fw-bold"
                >
                    <i class="bi bi-receipt-cutoff" ></i> Reporte de Productos más Vendidos
                </button>
            </div>
            
            <!-- Proyecciones -->
            <div class="col-12 col-md-3">
                <button 
                    @click="handleReportClick('projection')"
                    :class="{'btn-primary': activeReport === 'projection', 'btn-outline-primary': activeReport !== 'projection'}"
                    class="btn w-100 fw-bold"
                >
                    <i class="bi bi-graph-up-arrow"></i> Proyecciones
                </button>
            </div>
        </div>

        <!-- Contenedor Dinámico de Gráficos y Reportes -->
        <div v-if="chartData && activeReport !== null" class="card shadow-sm p-4 my-4 bg-light">
            
            <!-- Reporte de Ventas -->
            <div v-if="activeReport === 'sales'" class="text-center">
                <h5 class="card-title text-center text-secondary mb-4">
                    <i class="bi bi-graph-up me-2"></i> Total de Prendas Analizadas: 
                    <span class="fw-bold text-primary">{{ mockSalesData.dailySales + mockSalesData.weeklySales + mockSalesData.monthlySales }}</span>
                </h5>
                
                <div class="mx-auto" style="max-width: 500px; height: 400px;">
                    <Doughnut
                        :data="chartData"
                        :options="chartOptions"
                    />
                </div>
            </div>

            <!-- Reporte de Compras a Proveedores -->
            <div v-else-if="activeReport === 'purchases'" class="text-center">
                 <h5 class="card-title text-center text-secondary mb-4">
                    <i class="bi bi-shop me-2"></i> Total de Compras Registradas: 
                    <span class="fw-bold text-danger">{{ mockPurchasesData.reduce((sum, item) => sum + item.cantidad, 0) }}</span> prendas
                </h5>
                
                <div class="mx-auto" style="max-width: 900px; height: 400px;">
                    <Bar
                        :data="chartData"
                        :options="chartOptions"
                    />
                </div>
            </div>

            <div v-else-if="activeReport === 'products'" class="text-center">
                 <h5 class="card-title text-center text-secondary mb-4">
                    <i class="bi bi-receipt-cutoff me-2"></i> Total de Productos Vendidos: 
                    <span class="fw-bold text-success">{{ mockProductsData.reduce((sum, item) => sum + item.cantidad, 0) }}</span> prendas
                </h5>
                
                <div class="mx-auto" style="max-width: 900px; height: 400px;">
                    <Bar
                        :data="chartData"
                        :options="chartOptions"
                    />
                </div>
            </div>
            
            <div v-else-if="activeReport === 'projection'" class="text-center">
                 <h4 class="card-title text-center text-info mb-4">
                    <i class="bi bi-arrow-up-right-square me-2"></i> ANÁLISIS COMPLETO DE PROYECCIONES
                </h4>


                <div class="mb-5 border-bottom pb-4">
                    <div class="mx-auto" style="max-width: 900px; height: 400px;">
                        <Line
                            :data="chartData.salesProjection"
                            :options="chartOptions.salesProjection"
                        />
                    </div>
                </div>

                <!-- 2. Proyección por Producto -->
                <div class="mb-5 border-bottom pb-4">
                    <div class="mx-auto" style="max-width: 900px; height: 400px;">
                        <Bar
                            :data="chartData.productProjection"
                            :options="chartOptions.productProjection"
                        />
                    </div>
                </div>

                <!-- 3. Proyección de Compras a Proveedores -->
                <div class="mb-3">
                    <div class="mx-auto" style="max-width: 900px; height: 400px;">
                        <Bar
                            :data="chartData.purchaseProjection"
                            :options="chartOptions.purchaseProjection"
                        />
                    </div>
                </div>
            </div>
            
            <div v-else class="alert alert-warning text-center my-4" role="alert">
                <i class="bi bi-gear-fill me-2"></i> Reporte **{{ activeReport.charAt(0).toUpperCase() + activeReport.slice(1) }}** en construcción.
            </div>
        </div>
        
        <div v-else-if="activeReport !== null" class="alert alert-info text-center my-4" role="alert">
            <i class="bi bi-info-circle me-2"></i> Reporte **{{ activeReport.charAt(0).toUpperCase() + activeReport.slice(1) }}** en desarrollo. ¡Vamos por el siguiente!
        </div>
        
        <div v-else class="alert alert-secondary text-center my-4" role="alert">
            <i class="bi bi-hand-index-thumb me-2"></i> Haz clic en un botón para cargar su reporte y gráfico correspondiente.
        </div>
    </div>
</template>