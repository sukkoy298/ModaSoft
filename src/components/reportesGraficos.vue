<!-- ReportesGraficos.vue - VERSIÓN CON DATOS REALES -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement, LinearScale, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'vue-chartjs';
import Header from '@/components/Header.vue';

// Importar servicios REALES
import {
  obtenerReporteVentas,
  obtenerTopProductosVendidos,
  obtenerReporteCompras,
  obtenerProyeccionVentas,
  obtenerNecesidadesInventario
} from '@/reportesGraficos.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement, LinearScale, LineElement, PointElement);

const activeReport = ref('sales');
const chartData = ref(null);
const chartOptions = ref({});
const cargando = ref(false);
const error = ref(null);
const datosReales = ref({});

// Filtros
const filtros = ref({
  fechaInicio: '',
  fechaFin: '',
  limite: 10
});

// Configuración base de gráficos
const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: { size: 12 }
      }
    },
    title: {
      display: true,
      font: { size: 16, weight: 'bold' }
    }
  }
};

// Formateadores
const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD'
  }).format(valor || 0);
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  return new Date(fecha).toLocaleDateString('es-VE');
};

// 1. REPORTE DE VENTAS - CON DATOS REALES
const loadSalesReports = async () => {
  try {
    cargando.value = true;
    error.value = null;

    console.log('📊 Cargando ventas REALES...', {
      fechaInicio: filtros.value.fechaInicio,
      fechaFin: filtros.value.fechaFin
    });

    // Asegúrate de pasar las fechas como parámetros
    const ventasReales = await obtenerReporteVentas(filtros.value.fechaInicio, filtros.value.fechaFin);

    if (!ventasReales || ventasReales.length === 0) {
      throw new Error('No hay datos de ventas en el período seleccionado');
    }

    // Agrupar ventas por cliente para gráfico
    const ventasPorCliente = {};
    ventasReales.forEach(venta => {
      const clienteNombre = venta.Cliente?.nombre || 'Cliente Genérico';
      if (!ventasPorCliente[clienteNombre]) {
        ventasPorCliente[clienteNombre] = 0;
      }
      ventasPorCliente[clienteNombre] += parseFloat(venta.total || 0);
    });

    // Ordenar por monto
    const clientesOrdenados = Object.entries(ventasPorCliente)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    datosReales.value.ventas = ventasReales;

    chartOptions.value = {
      ...baseChartOptions,
      plugins: {
        ...baseChartOptions.plugins,
        title: {
          ...baseChartOptions.plugins.title,
          text: 'Ventas por Cliente'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== undefined) {
                label += formatearMoneda(context.parsed);
              }
              return label;
            }
          }
        }
      }
    };

    chartData.value = {
      labels: clientesOrdenados.map(([cliente]) => cliente),
      datasets: [
        {
          label: 'Total Ventas',
          backgroundColor: ['#0d6efd', '#20c997', '#ffc107', '#dc3545', '#6f42c1'],
          data: clientesOrdenados.map(([, monto]) => monto)
        }
      ]
    };

    activeReport.value = 'sales';
    console.log('✅ Ventas cargadas:', ventasReales.length, 'registros');
  } catch (err) {
    error.value = `Error cargando ventas: ${err.message}`;
    console.error('❌ Error en ventas:', err);
  } finally {
    cargando.value = false;
  }
};

// 2. REPORTE DE COMPRAS A PROVEEDORES - DATOS REALES
const loadPurchasesReports = async () => {
  try {
    cargando.value = true;
    error.value = null;

    console.log('🏭 Cargando compras REALES...', {
      fechaInicio: filtros.value.fechaInicio,
      fechaFin: filtros.value.fechaFin
    });

    // Asegúrate de pasar las fechas como parámetros
    const comprasReales = await obtenerReporteCompras(filtros.value.fechaInicio, filtros.value.fechaFin);

    if (!comprasReales || comprasReales.length === 0) {
      throw new Error('No hay datos de compras en el período seleccionado');
    }

    datosReales.value.compras = comprasReales;

    chartOptions.value = {
      ...baseChartOptions,
      indexAxis: 'x',
      plugins: {
        ...baseChartOptions.plugins,
        legend: { display: false },
        title: {
          ...baseChartOptions.plugins.title,
          text: 'Compras a Proveedores'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== undefined) {
                label += formatearMoneda(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Monto Total',
            font: { weight: 'bold', size: 14 }
          },
          ticks: {
            callback: function (value) {
              return formatearMoneda(value);
            }
          }
        }
      }
    };

    // Agrupar compras por proveedor
    const comprasPorProveedor = {};
    comprasReales.forEach(compra => {
      const proveedorNombre = compra.Proveedor?.nombre || 'Proveedor';
      if (!comprasPorProveedor[proveedorNombre]) {
        comprasPorProveedor[proveedorNombre] = 0;
      }
      comprasPorProveedor[proveedorNombre] += parseFloat(compra.total || 0);
    });

    const proveedoresOrdenados = Object.entries(comprasPorProveedor)
      .sort((a, b) => b[1] - a[1])
      .slice(0, filtros.value.limite);

    chartData.value = {
      labels: proveedoresOrdenados.map(([proveedor]) => proveedor),
      datasets: [
        {
          label: 'Monto Compras',
          backgroundColor: '#dc3545',
          data: proveedoresOrdenados.map(([, monto]) => monto)
        }
      ]
    };

    activeReport.value = 'purchases';
    console.log('✅ Compras cargadas:', comprasReales.length, 'registros');
  } catch (err) {
    error.value = `Error cargando compras: ${err.message}`;
    console.error('❌ Error en compras:', err);
  } finally {
    cargando.value = false;
  }
};

// 3. REPORTE DE PRODUCTOS MÁS VENDIDOS - DATOS REALES
// 3. REPORTE DE PRODUCTOS MÁS VENDIDOS - DATOS REALES
const loadProductsReports = async () => {
  try {
    cargando.value = true;
    error.value = null;

    console.log('📦 Cargando productos más vendidos...');
    const productosReales = await obtenerTopProductosVendidos(
      filtros.value.limite,
      filtros.value.fechaInicio,
      filtros.value.fechaFin
    );

    console.log('📊 Productos recibidos del backend:', JSON.stringify(productosReales, null, 2));

    if (!productosReales || productosReales.length === 0) {
      throw new Error('No se encontraron productos vendidos en el período seleccionado');
    }

    datosReales.value.productos = productosReales;

    // Preparar datos para gráfico - VERSIÓN SIMPLIFICADA Y FUNCIONAL
    const productosParaGrafico = [];

    productosReales.forEach(producto => {
      // Obtener nombre
      const nombre = producto.nombre ||
        producto.VarianteProducto?.ProductoPrincipal?.nombre ||
        'Producto sin nombre';

      // Obtener cantidad - VERSIÓN MÁS DIRECTA
      let cantidad = 0;

      // IMPORTANTE: según tus logs, el producto viene con "total_vendido": 4
      if (producto.total_vendido !== undefined) {
        cantidad = Number(producto.total_vendido);
      }
      // Otras posibles propiedades
      else if (producto.cantidad !== undefined) {
        cantidad = Number(producto.cantidad);
      }
      else if (producto.cantidad_vendida !== undefined) {
        cantidad = Number(producto.cantidad_vendida);
      }

      console.log(`📊 Producto: "${nombre}" - Cantidad: ${cantidad}`);

      if (cantidad > 0) {
        productosParaGrafico.push({
          nombre: nombre.substring(0, 25),
          cantidad: cantidad
        });
      }
    });

    // Ordenar por cantidad descendente
    productosParaGrafico.sort((a, b) => b.cantidad - a.cantidad);

    console.log('📈 Productos para gráfico (final):', productosParaGrafico);

    // Configuración ESPECÍFICA para productos
    chartOptions.value = {
      ...baseChartOptions,
      indexAxis: 'y',
      plugins: {
        ...baseChartOptions.plugins,
        legend: { display: false },
        title: {
          ...baseChartOptions.plugins.title,
          text: `Top ${productosParaGrafico.length} Productos Más Vendidos`
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label || ''}: ${context.parsed.x || context.parsed.y} unidades`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad Vendida (unidades)',
            font: { weight: 'bold', size: 14 }
          },
          ticks: {
            // Mostrar solo números enteros
            stepSize: 1,
            callback: function (value) {
              return Math.round(value);
            }
          }
        }
      }
    };

    // Datos del gráfico - VERIFICAR QUE HAY DATOS
    if (productosParaGrafico.length === 0) {
      console.warn('⚠️ No hay productos con cantidad > 0');

      // Mostrar mensaje de advertencia en lugar de gráfico falso
      chartData.value = null;
    } else {
      // ASIGNACIÓN CORRECTA DE DATOS
      chartData.value = {
        labels: productosParaGrafico.map(p => p.nombre),
        datasets: [
          {
            label: 'Cantidad Vendida',
            backgroundColor: '#198754',
            borderColor: '#0d6e2d',
            borderWidth: 2,
            borderRadius: 5,
            data: productosParaGrafico.map(p => p.cantidad) // ← ESTO DEBE SER UN ARRAY DE NÚMEROS
          }
        ]
      };

      console.log('📊 Datos del gráfico:', chartData.value);
      console.log('📊 Etiquetas:', chartData.value.labels);
      console.log('📊 Cantidades:', chartData.value.datasets[0].data);
    }

    activeReport.value = 'products';

  } catch (err) {
    error.value = `Error cargando productos más vendidos: ${err.message}`;
    console.error('❌ Error en loadProductsReports:', err);
  } finally {
    cargando.value = false;
  }
};

// 4. PROYECCIONES - CON DATOS REALES
const loadProjectionReports = async () => {
  try {
    cargando.value = true;
    error.value = null;

    console.log('📈 Cargando proyecciones REALES...');

    // Obtener ventas reales para proyección (con fechas si es necesario)
    const ventasReales = await obtenerReporteVentas(filtros.value.fechaInicio, filtros.value.fechaFin);
    const proyeccionData = await obtenerProyeccionVentas(3);
    const necesidadesInventario = await obtenerNecesidadesInventario();

    datosReales.value.proyeccion = { ventasReales, proyeccionData, necesidadesInventario };

    // Formatear meses para el gráfico
    const labelsProyeccion = [
      ...proyeccionData.historico.map(h => h.mes),
      ...proyeccionData.proyeccion.map(p => p.mes)
    ];

    // Gráfico de proyección
    const salesDataset = {
      labels: labelsProyeccion,
      datasets: [
        {
          type: 'line',
          label: 'Ventas Históricas',
          data: [
            ...proyeccionData.historico.map(h => h.ventas),
            ...Array(proyeccionData.proyeccion.length).fill(null)
          ],
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.2)',
          fill: false,
          tension: 0.3,
          borderWidth: 3
        },
        {
          type: 'line',
          label: 'Ventas Proyectadas',
          data: [
            ...Array(proyeccionData.historico.length).fill(null),
            ...proyeccionData.proyeccion.map(p => p.ventas)
          ],
          borderColor: '#20c997',
          backgroundColor: 'rgba(32, 201, 151, 0.4)',
          borderDash: [5, 5],
          fill: false,
          tension: 0.3,
          borderWidth: 3
        }
      ]
    };

    // Gráfico de necesidades de inventario
    const inventoryDataset = {
      labels: necesidadesInventario
        .slice(0, 8)
        .map(n => n.producto.nombre.substring(0, 20)),
      datasets: [
        {
          label: 'Cantidad Necesaria',
          backgroundColor: '#6f42c1',
          data: necesidadesInventario
            .slice(0, 8)
            .map(n => n.cantidad_necesaria)
        }
      ]
    };

    chartData.value = {
      salesProjection: salesDataset,
      inventoryNeeds: inventoryDataset
    };

    chartOptions.value = {
      salesProjection: {
        ...baseChartOptions,
        plugins: {
          ...baseChartOptions.plugins,
          title: {
            ...baseChartOptions.plugins.title,
            text: 'Proyección de Ventas'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== undefined) {
                  label += formatearMoneda(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return formatearMoneda(value);
              }
            }
          }
        }
      },
      inventoryNeeds: {
        ...baseChartOptions,
        indexAxis: 'y',
        plugins: {
          ...baseChartOptions.plugins,
          legend: { display: false },
          title: {
            ...baseChartOptions.plugins.title,
            text: 'Necesidades de Inventario (Stock Bajo)'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label || ''}: ${context.parsed.x || context.parsed.y} unidades`;
              }
            }
          }
        }
      }
    };

    activeReport.value = 'projection';
    console.log('✅ Proyecciones cargadas');
  } catch (err) {
    error.value = `Error cargando proyecciones: ${err.message}`;
    console.error('❌ Error en proyecciones:', err);
  } finally {
    cargando.value = false;
  }
};

// Manejar clic en reportes
const handleReportClick = async (reportKey) => {
  if (activeReport.value === reportKey && !cargando.value) {
    // Si ya está activo, recargar
    await cargarReporte(reportKey);
    return;
  }

  activeReport.value = reportKey;
  await cargarReporte(reportKey);
};

const cargarReporte = async (reportKey) => {
  switch (reportKey) {
    case 'sales':
      await loadSalesReports();
      break;
    case 'purchases':
      await loadPurchasesReports();
      break;
    case 'products':
      await loadProductsReports();
      break;
    case 'projection':
      await loadProjectionReports();
      break;
  }
};

// Estadísticas calculadas
const estadisticas = computed(() => {
  if (!datosReales.value.ventas) return null;

  const ventas = datosReales.value.ventas;
  const totalVentas = ventas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
  const totalClientes = new Set(ventas.map(v => v.cedula_cliente)).size;
  const promedioVenta = ventas.length > 0 ? totalVentas / ventas.length : 0;

  return {
    totalVentas,
    totalClientes,
    promedioVenta,
    totalRegistros: ventas.length
  };
});

// Cargar reporte inicial
onMounted(() => {
  // Establecer fechas por defecto (últimos 30 días)
  const fechaFin = new Date();
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - 30);

  filtros.value.fechaInicio = fechaInicio.toISOString().split('T')[0];
  filtros.value.fechaFin = fechaFin.toISOString().split('T')[0];

  // Cargar reporte de ventas por defecto
  loadSalesReports();
});

// Métodos adicionales para productos
const calcularPrecioUnitario = (producto) => {
  // Calcular precio unitario basado en el total y cantidad
  const cantidad = producto.total_vendido || producto.cantidad || 1;
  const montoTotal = producto.monto_total || producto.venta_total || 0;

  if (cantidad > 0 && montoTotal > 0) {
    return montoTotal / cantidad;
  }

  // Si no hay datos, intentar obtener precio de otras propiedades
  return producto.precio_unitario ||
    producto.precio ||
    producto.VarianteProducto?.precio_venta ||
    0;
};

const calcularTotalProducto = (producto) => {
  const cantidad = producto.total_vendido || producto.cantidad || 0;
  const precioUnitario = calcularPrecioUnitario(producto);
  return cantidad * precioUnitario;
};
</script>

<template>
  <Header />

  <div class="container-fluid mt-3">
    <!-- Encabezado -->
    <div class="card shadow-sm mb-4 border-danger">
      <div class="card-body text-center bg-danger bg-opacity-10">
        <h1 class="text-danger mb-2">
          <i class="bi bi-graph-up"></i> REPORTES Y ANÁLISIS
        </h1>
        <p class="text-muted mb-0 fw-bold">Datos REALES de tu sistema ModaSoft</p>
        <small class="text-muted">Base de datos: modasoft2 | Última actualización: {{ new
          Date().toLocaleDateString('es-VE') }}</small>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label fw-bold">Fecha Inicio</label>
            <input type="date" v-model="filtros.fechaInicio" class="form-control border-danger"
              @change="cargarReporte(activeReport)">
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold">Fecha Fin</label>
            <input type="date" v-model="filtros.fechaFin" class="form-control border-danger"
              @change="cargarReporte(activeReport)">
          </div>
          <div class="col-md-2">
            <label class="form-label fw-bold">Límite</label>
            <input type="number" v-model="filtros.limite" class="form-control border-danger" min="1" max="50"
              @change="cargarReporte(activeReport)">
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button @click="cargarReporte(activeReport)" class="btn btn-danger w-100 fw-bold"
              :disabled="cargando || !activeReport">
              <i class="bi bi-arrow-clockwise"></i>
              {{ cargando ? 'ACTUALIZANDO...' : 'ACTUALIZAR REPORTE' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de Reportes -->
    <div class="row g-2 mb-4">
      <div class="col-12 col-md-3">
        <button @click="handleReportClick('sales')"
          :class="{ 'btn-danger': activeReport === 'sales', 'btn-outline-danger': activeReport !== 'sales' }"
          class="btn w-100 fw-bold py-3" :disabled="cargando">
          <i class="bi bi-cash-coin fs-4"></i><br>
          <span v-if="cargando && activeReport === 'sales'">CARGANDO...</span>
          <span v-else>REPORTE DE VENTAS</span>
          <div v-if="estadisticas" class="small mt-1">
            {{ estadisticas.totalRegistros }} ventas
          </div>
        </button>
      </div>

      <div class="col-12 col-md-3">
        <button @click="handleReportClick('purchases')"
          :class="{ 'btn-danger': activeReport === 'purchases', 'btn-outline-danger': activeReport !== 'purchases' }"
          class="btn w-100 fw-bold py-3" :disabled="cargando">
          <i class="bi bi-shop fs-4"></i><br>
          <span v-if="cargando && activeReport === 'purchases'">CARGANDO...</span>
          <span v-else>COMPRAS A PROVEEDORES</span>
        </button>
      </div>

      <div class="col-12 col-md-3">
        <button @click="handleReportClick('products')"
          :class="{ 'btn-danger': activeReport === 'products', 'btn-outline-danger': activeReport !== 'products' }"
          class="btn w-100 fw-bold py-3" :disabled="cargando">
          <i class="bi bi-receipt-cutoff fs-4"></i><br>
          <span v-if="cargando && activeReport === 'products'">CARGANDO...</span>
          <span v-else>PRODUCTOS MÁS VENDIDOS</span>
        </button>
      </div>

      <div class="col-12 col-md-3">
        <button @click="handleReportClick('projection')"
          :class="{ 'btn-danger': activeReport === 'projection', 'btn-outline-danger': activeReport !== 'projection' }"
          class="btn w-100 fw-bold py-3" :disabled="cargando">
          <i class="bi bi-graph-up-arrow fs-4"></i><br>
          <span v-if="cargando && activeReport === 'projection'">CARGANDO...</span>
          <span v-else>PROYECCIONES</span>
        </button>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="card shadow-sm mb-4">
      <div class="card-body text-center py-5">
        <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 fw-bold">CONSULTANDO BASE DE DATOS REAL...</p>
        <small class="text-muted">Obteniendo datos en tiempo real de modasoft2</small>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger alert-dismissible fade show shadow-sm">
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
        <div>
          <h5 class="alert-heading mb-1">ERROR DE CONEXIÓN</h5>
          <p class="mb-0">{{ error }}</p>
          <small>Verifica que los endpoints estén funcionando</small>
        </div>
      </div>
      <button type="button" class="btn-close" @click="error = null"></button>
    </div>

    <!-- Gráficos con Datos Reales -->
    <div v-else-if="chartData && activeReport" class="card shadow-sm mb-4">
      <div class="card-body p-4">

        <!-- Reporte de Ventas -->
        <div v-if="activeReport === 'sales'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 class="text-danger mb-1">
                <i class="bi bi-cash-coin me-2"></i> REPORTE DE VENTAS
              </h4>
              <p class="text-muted mb-0">Datos reales de ventas en el período seleccionado</p>
            </div>
            <div class="text-end">
              <div class="badge bg-danger fs-6">TOTAL: {{ formatearMoneda(estadisticas?.totalVentas || 0) }}</div>
              <div class="small text-muted">{{ estadisticas?.totalRegistros || 0 }} transacciones</div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-8">
              <div style="height: 400px;">
                <Doughnut :data="chartData" :options="chartOptions" />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card border-danger">
                <div class="card-header bg-danger text-white">
                  <h6 class="mb-0">RESUMEN DE VENTAS</h6>
                </div>
                <div class="card-body">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <span>Total Ventas:</span>
                      <strong class="text-danger">{{ formatearMoneda(estadisticas?.totalVentas || 0) }}</strong>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <span>Ventas Promedio:</span>
                      <strong>{{ formatearMoneda(estadisticas?.promedioVenta || 0) }}</strong>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <span>Clientes Únicos:</span>
                      <strong>{{ estadisticas?.totalClientes || 0 }}</strong>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <span>Transacciones:</span>
                      <strong>{{ estadisticas?.totalRegistros || 0 }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tabla de últimas ventas -->
              <div class="card mt-3">
                <div class="card-header">
                  <h6 class="mb-0">ÚLTIMAS VENTAS</h6>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive" style="max-height: 200px; overflow-y: auto;">
                    <table class="table table-sm table-hover mb-0">
                      <thead class="table-light">
                        <tr>
                          <th>Fecha</th>
                          <th>Cliente</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="venta in (datosReales.ventas || []).slice(0, 5)" :key="venta.id_venta">
                          <td>{{ formatearFecha(venta.fecha) }}</td>
                          <td>{{ venta.Cliente?.nombre || 'N/A' }}</td>
                          <td class="fw-bold">{{ formatearMoneda(venta.total) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reporte de Compras -->
        <div v-else-if="activeReport === 'purchases'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 class="text-danger mb-1">
                <i class="bi bi-shop me-2"></i> COMPRAS A PROVEEDORES
              </h4>
              <p class="text-muted mb-0">Análisis de compras realizadas a proveedores</p>
            </div>
          </div>

          <div style="height: 400px;">
            <Bar :data="chartData" :options="chartOptions" />
          </div>

          <!-- Tabla de compras -->
          <div class="mt-4">
            <h6 class="border-bottom pb-2">DETALLE DE COMPRAS</h6>
            <div class="table-responsive">
              <table class="table table-sm table-hover">
                <thead class="table-danger">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Proveedor</th>
                    <th>Factura</th>
                    <th>Subtotal</th>
                    <th>IVA</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="compra in (datosReales.compras || []).slice(0, 10)" :key="compra.id_compra">
                    <td>#{{ compra.id_compra }}</td>
                    <td>{{ formatearFecha(compra.fecha) }}</td>
                    <td>{{ compra.Proveedor?.nombre || 'N/A' }}</td>
                    <td>{{ compra.nro_factura || 'N/A' }}</td>
                    <td>{{ formatearMoneda(compra.subtotal) }}</td>
                    <td>{{ formatearMoneda(compra.iva) }}</td>
                    <td class="fw-bold text-danger">{{ formatearMoneda(compra.total) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Reporte de Productos - VERSIÓN CON GRÁFICO -->
        <div v-else-if="activeReport === 'products'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 class="text-danger mb-1">
                <i class="bi bi-receipt-cutoff me-2"></i> PRODUCTOS MÁS VENDIDOS
              </h4>
              <p class="text-muted mb-0">Ranking de productos por cantidad vendida</p>
            </div>
            <div class="text-end" v-if="datosReales.productos && datosReales.productos.length > 0">
              <div class="badge bg-success fs-6">
                {{ datosReales.productos.length }} producto{{ datosReales.productos.length !== 1 ? 's' : '' }}
              </div>
              <div class="small text-muted">Total vendido: {{datosReales.productos.reduce((sum, p) => sum +
                (p.total_vendido || p.cantidad || 0), 0)}} unidades</div>
            </div>
          </div>

          <!-- GRÁFICO - SOLO SI HAY DATOS -->
          <div v-if="chartData && activeReport === 'products'">
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <h5 class="text-secondary mb-3">GRÁFICO DE PRODUCTOS MÁS VENDIDOS</h5>
                <div style="height: 300px;">
                  <Bar :data="chartData" :options="chartOptions" />
                </div>
              </div>
            </div>
          </div>

          <!-- MENSAJE SI NO HAY DATOS PARA EL GRÁFICO -->
          <div v-else-if="datosReales.productos && datosReales.productos.length > 0" class="alert alert-warning">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Hay productos pero no se pudo generar el gráfico. Revisa la estructura de datos.
          </div>

          <!-- LUEGO LA TABLA -->
          <div class="card shadow-sm" v-if="datosReales.productos && datosReales.productos.length > 0">
            <div class="card-header bg-light">
              <h6 class="mb-0">DETALLE POR PRODUCTO</h6>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="ps-4">#</th>
                      <th>Producto</th>
                      <th class="text-center">Cantidad Vendida</th>
                      <th class="text-center">Precio Promedio</th>
                      <th class="text-end pe-4">Total Generado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(producto, index) in datosReales.productos" :key="index">
                      <td class="ps-4 fw-bold">{{ index + 1 }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="flex-shrink-0">
                            <div class="bg-light rounded p-2 me-3">
                              <i class="bi bi-box-seam text-primary"></i>
                            </div>
                          </div>
                          <div class="flex-grow-1">
                            <h6 class="mb-0">{{ producto.nombre || producto.VarianteProducto?.ProductoPrincipal?.nombre
                              || 'Producto sin nombre' }}</h6>
                            <small class="text-muted">{{ producto.codigo || producto.VarianteProducto?.codigo || 'Sin código' }}</small>
                          </div>
                        </div>
                      </td>
                      <td class="text-center">
                        <span class="badge bg-danger rounded-pill fs-6">
                          {{ producto.total_vendido || producto.cantidad || 0 }}
                        </span>
                        <div class="small text-muted">unidades</div>
                      </td>
                      <td class="text-center">
                        {{ formatearMoneda(calcularPrecioUnitario(producto)) }}
                      </td>
                      <td class="text-end fw-bold pe-4 text-success">
                        {{ formatearMoneda(calcularTotalProducto(producto)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- MENSAJE CUANDO NO HAY PRODUCTOS -->
          <div class="text-center py-5" v-else>
            <div class="py-5">
              <i class="bi bi-inbox display-1 text-muted"></i>
              <h5 class="mt-3 text-muted">No hay productos vendidos en el período seleccionado</h5>
              <p class="text-muted">Intenta cambiar las fechas del reporte</p>
            </div>
          </div>
        </div>

        <!-- Proyecciones -->
        <div v-else-if="activeReport === 'projection'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 class="text-danger mb-1">
                <i class="bi bi-graph-up-arrow me-2"></i> ANÁLISIS DE PROYECCIONES
              </h4>
              <p class="text-muted mb-0">Proyección basada en datos históricos reales</p>
            </div>
          </div>

          <div class="mb-5">
            <h5 class="text-secondary mb-3">PROYECCIÓN DE VENTAS</h5>
            <div style="height: 350px;">
              <Line :data="chartData.salesProjection" :options="chartOptions.salesProjection" />
            </div>
          </div>

          <div class="mb-3">
            <h5 class="text-secondary mb-3">NECESIDADES DE INVENTARIO</h5>
            <div style="height: 300px;">
              <Bar :data="chartData.inventoryNeeds" :options="chartOptions.inventoryNeeds" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin datos seleccionados -->
    <div v-else class="card shadow-sm">
      <div class="card-body text-center py-5">
        <i class="bi bi-database fs-1 text-danger opacity-50 mb-3"></i>
        <h5 class="text-muted">SELECCIONA UN REPORTE</h5>
        <p class="text-muted mb-0">Haz clic en cualquiera de los botones arriba para visualizar datos REALES de tu
          sistema</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  transition: all 0.3s ease;
  border-width: 2px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

.card {
  border: 1px solid #dee2e6;
}

.table th {
  font-weight: 600;
  font-size: 0.9rem;
}

.list-group-item {
  border: none;
  padding: 0.75rem 0;
}

.badge {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}
</style>