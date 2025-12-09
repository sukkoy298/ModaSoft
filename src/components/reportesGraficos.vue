<template>
  <Header />

  <div class="container moda-main-container mt-5 mb-5">
    <!-- Encabezado -->
    <div class="moda-card moda-card-header mb-4">
      <div class="moda-card-body text-center">
        <h1 class="moda-title mb-2">
          <i class="bi bi-graph-up moda-icon-danger me-2"></i> REPORTES Y ANÁLISIS
        </h1>
        <p class="moda-subtitle mb-0 fw-bold">Datos REALES de tu sistema ModaSoft</p>
        <small class="moda-text-muted">Base de datos: modasoft2 | Última actualización: {{
          new Date().toLocaleDateString('es-VE') }}</small>
      </div>
    </div>

    <!-- Filtros -->
    <div class="moda-card mb-4">
      <div class="moda-card-body">
        <h6 class="moda-subtitle mb-3">
          <i class="bi bi-calendar-range me-2"></i> Filtros del Reporte
        </h6>
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="moda-label">Fecha Inicio</label>
            <input type="date" v-model="filtros.fechaInicio" class="moda-input"
              @change="cargarReporte(activeReport)">
          </div>
          <div class="col-md-3">
            <label class="moda-label">Fecha Fin</label>
            <input type="date" v-model="filtros.fechaFin" class="moda-input"
              @change="cargarReporte(activeReport)">
          </div>
          <div class="col-md-2">
            <label class="moda-label">Límite</label>
            <input type="number" v-model="filtros.limite" class="moda-input" min="1" max="50"
              @change="cargarReporte(activeReport)">
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button @click="cargarReporte(activeReport)" class="btn moda-btn-primary w-100"
              :disabled="cargando || !activeReport">
              <i class="bi bi-arrow-clockwise me-2"></i>
              {{ cargando ? 'ACTUALIZANDO...' : 'ACTUALIZAR REPORTE' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de Reportes -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-3">
        <button @click="handleReportClick('sales')"
          :class="{ 'moda-btn-primary': activeReport === 'sales', 'moda-btn-outline': activeReport !== 'sales' }"
          class="btn w-100 moda-report-btn py-3" :disabled="cargando">
          <div class="moda-report-icon">
            <i class="bi bi-cash-coin"></i>
          </div>
          <div class="moda-report-title">
            <span v-if="cargando && activeReport === 'sales'">CARGANDO...</span>
            <span v-else>REPORTE DE VENTAS</span>
          </div>
          <div v-if="estadisticas" class="moda-report-subtitle">
            {{ estadisticas.totalRegistros }} ventas
          </div>
        </button>
      </div>

      <div class="col-12 col-md-3">
        <button @click="handleReportClick('purchases')"
          :class="{ 'moda-btn-primary': activeReport === 'purchases', 'moda-btn-outline': activeReport !== 'purchases' }"
          class="btn w-100 moda-report-btn py-3" :disabled="cargando">
          <div class="moda-report-icon">
            <i class="bi bi-shop"></i>
          </div>
          <div class="moda-report-title">
            <span v-if="cargando && activeReport === 'purchases'">CARGANDO...</span>
            <span v-else>COMPRAS A PROVEEDORES</span>
          </div>
        </button>
      </div>

      <div class="col-12 col-md-3">
        <button @click="handleReportClick('products')"
          :class="{ 'moda-btn-primary': activeReport === 'products', 'moda-btn-outline': activeReport !== 'products' }"
          class="btn w-100 moda-report-btn py-3" :disabled="cargando">
          <div class="moda-report-icon">
            <i class="bi bi-receipt-cutoff"></i>
          </div>
          <div class="moda-report-title">
            <span v-if="cargando && activeReport === 'products'">CARGANDO...</span>
            <span v-else>PRODUCTOS MÁS VENDIDOS</span>
          </div>
        </button>
      </div>

      <div class="col-12 col-md-3">
        <button @click="handleReportClick('projection')"
          :class="{ 'moda-btn-primary': activeReport === 'projection', 'moda-btn-outline': activeReport !== 'projection' }"
          class="btn w-100 moda-report-btn py-3" :disabled="cargando">
          <div class="moda-report-icon">
            <i class="bi bi-graph-up-arrow"></i>
          </div>
          <div class="moda-report-title">
            <span v-if="cargando && activeReport === 'projection'">CARGANDO...</span>
            <span v-else>PROYECCIONES</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="moda-card mb-4">
      <div class="moda-card-body text-center py-5">
        <div class="moda-spinner"></div>
        <p class="mt-3 moda-subtitle fw-bold">CONSULTANDO BASE DE DATOS REAL...</p>
        <small class="moda-text-muted">Obteniendo datos en tiempo real de modasoft2</small>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="moda-alert moda-alert-error">
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
        <div>
          <h5 class="moda-alert-title mb-1">ERROR DE CONEXIÓN</h5>
          <p class="mb-0">{{ error }}</p>
          <small class="moda-text-muted">Verifica que los endpoints estén funcionando</small>
        </div>
      </div>
      <button type="button" class="btn-close" @click="error = null"></button>
    </div>

    <!-- Gráficos con Datos Reales -->
    <div v-else-if="chartData && activeReport" class="moda-card mb-4">
      <div class="moda-card-body p-4">

        <!-- Reporte de Ventas -->
        <div v-if="activeReport === 'sales'">
          <div class="moda-report-header mb-4">
            <div>
              <h4 class="moda-report-title">
                <i class="bi bi-cash-coin me-2"></i> REPORTE DE VENTAS
              </h4>
              <p class="moda-report-subtitle">Datos reales de ventas en el período seleccionado</p>
            </div>
            <div class="moda-report-stats">
              <div class="moda-stat-item">
                TOTAL: {{ formatearMoneda(estadisticas?.totalVentas || 0) }}
              </div>
              <div class="moda-stat-subtitle">{{ estadisticas?.totalRegistros || 0 }} transacciones</div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-8">
              <div class="moda-chart-container">
                <Doughnut :data="chartData" :options="chartOptions" />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="moda-summary-card">
                <div class="moda-summary-header">
                  <h6 class="mb-0">RESUMEN DE VENTAS</h6>
                </div>
                <div class="moda-summary-body">
                  <div class="moda-summary-list">
                    <div class="moda-summary-item">
                      <span>Total Ventas:</span>
                      <strong class="moda-amount-total">{{ formatearMoneda(estadisticas?.totalVentas || 0) }}</strong>
                    </div>
                    <div class="moda-summary-item">
                      <span>Ventas Promedio:</span>
                      <strong>{{ formatearMoneda(estadisticas?.promedioVenta || 0) }}</strong>
                    </div>
                    <div class="moda-summary-item">
                      <span>Clientes Únicos:</span>
                      <strong>{{ estadisticas?.totalClientes || 0 }}</strong>
                    </div>
                    <div class="moda-summary-item">
                      <span>Transacciones:</span>
                      <strong>{{ estadisticas?.totalRegistros || 0 }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tabla de últimas ventas -->
              <div class="moda-table-card mt-3">
                <div class="moda-table-header">
                  <h6 class="mb-0">ÚLTIMAS VENTAS</h6>
                </div>
                <div class="moda-table-container">
                  <table class="moda-table">
                    <thead>
                      <tr>
                        <th class="moda-table-th">Fecha</th>
                        <th class="moda-table-th">Cliente</th>
                        <th class="moda-table-th text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="venta in (datosReales.ventas || []).slice(0, 5)" :key="venta.id_venta"
                        :class="'moda-row-' + (venta.id_venta % 2 === 0 ? 'even' : 'odd')">
                        <td class="moda-table-td">{{ formatearFecha(venta.fecha) }}</td>
                        <td class="moda-table-td">{{ venta.Cliente?.nombre || 'N/A' }}</td>
                        <td class="moda-table-td text-end fw-bold moda-amount-total">{{ formatearMoneda(venta.total) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reporte de Compras -->
        <div v-else-if="activeReport === 'purchases'">
          <div class="moda-report-header mb-4">
            <div>
              <h4 class="moda-report-title">
                <i class="bi bi-shop me-2"></i> COMPRAS A PROVEEDORES
              </h4>
              <p class="moda-report-subtitle">Análisis de compras realizadas a proveedores</p>
            </div>
          </div>

          <div class="moda-chart-container">
            <Bar :data="chartData" :options="chartOptions" />
          </div>

          <!-- Tabla de compras -->
          <div class="mt-4">
            <h6 class="moda-section-title pb-2">DETALLE DE COMPRAS</h6>
            <div class="moda-table-container">
              <table class="moda-table">
                <thead>
                  <tr>
                    <th class="moda-table-th">ID</th>
                    <th class="moda-table-th">Fecha</th>
                    <th class="moda-table-th">Proveedor</th>
                    <th class="moda-table-th">Factura</th>
                    <th class="moda-table-th text-end">Subtotal</th>
                    <th class="moda-table-th text-end">IVA</th>
                    <th class="moda-table-th text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="compra in (datosReales.compras || []).slice(0, 10)" :key="compra.id_compra"
                    :class="'moda-row-' + (compra.id_compra % 2 === 0 ? 'even' : 'odd')">
                    <td class="moda-table-td">#{{ compra.id_compra }}</td>
                    <td class="moda-table-td">{{ formatearFecha(compra.fecha) }}</td>
                    <td class="moda-table-td">{{ compra.Proveedor?.nombre || 'N/A' }}</td>
                    <td class="moda-table-td">{{ compra.nro_factura || 'N/A' }}</td>
                    <td class="moda-table-td text-end">{{ formatearMoneda(compra.subtotal) }}</td>
                    <td class="moda-table-td text-end">{{ formatearMoneda(compra.iva) }}</td>
                    <td class="moda-table-td text-end fw-bold moda-amount-total">{{ formatearMoneda(compra.total) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Reporte de Productos -->
        <div v-else-if="activeReport === 'products'">
          <div class="moda-report-header mb-4">
            <div>
              <h4 class="moda-report-title">
                <i class="bi bi-receipt-cutoff me-2"></i> PRODUCTOS MÁS VENDIDOS
              </h4>
              <p class="moda-report-subtitle">Ranking de productos por cantidad vendida</p>
            </div>
            <div class="moda-report-stats" v-if="datosReales.productos && datosReales.productos.length > 0">
              <div class="moda-stat-item moda-stat-success">
                {{ datosReales.productos.length }} producto{{ datosReales.productos.length !== 1 ? 's' : '' }}
              </div>
              <div class="moda-stat-subtitle">Total vendido: {{datosReales.productos.reduce((sum, p) => sum +
                (p.total_vendido || p.cantidad || 0), 0)}} unidades</div>
            </div>
          </div>

          <!-- GRÁFICO -->
          <div v-if="chartData && activeReport === 'products'">
            <div class="moda-card mb-4">
              <div class="moda-card-body">
                <h5 class="moda-chart-title mb-3">GRÁFICO DE PRODUCTOS MÁS VENDIDOS</h5>
                <div class="moda-chart-container">
                  <Bar :data="chartData" :options="chartOptions" />
                </div>
              </div>
            </div>
          </div>

          <!-- MENSAJE SI NO HAY DATOS PARA EL GRÁFICO -->
          <div v-else-if="datosReales.productos && datosReales.productos.length > 0" class="moda-alert moda-alert-warning">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Hay productos pero no se pudo generar el gráfico. Revisa la estructura de datos.
          </div>

          <!-- TABLA DE PRODUCTOS -->
          <div class="moda-card" v-if="datosReales.productos && datosReales.productos.length > 0">
            <div class="moda-table-container">
              <table class="moda-table">
                <thead>
                  <tr>
                    <th class="moda-table-th text-center">#</th>
                    <th class="moda-table-th">Producto</th>
                    <th class="moda-table-th text-center">Cantidad Vendida</th>
                    <th class="moda-table-th text-center">Precio Promedio</th>
                    <th class="moda-table-th text-end">Total Generado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(producto, index) in datosReales.productos" :key="index"
                    :class="'moda-row-' + (index % 2 === 0 ? 'even' : 'odd')">
                    <td class="moda-table-td text-center fw-bold">
                      <span class="moda-rank-badge" :class="getRankClass(index)">
                        {{ index + 1 }}
                      </span>
                    </td>
                    <td class="moda-table-td">
                      <div class="moda-product-info">
                        <div class="moda-product-icon">
                          <i class="bi bi-box-seam"></i>
                        </div>
                        <div class="moda-product-details">
                          <h6 class="moda-product-name">{{ producto.nombre || producto.VarianteProducto?.ProductoPrincipal?.nombre
                            || 'Producto sin nombre' }}</h6>
                          <small class="moda-product-code">{{ producto.codigo || producto.VarianteProducto?.codigo || 'Sin código' }}</small>
                        </div>
                      </div>
                    </td>
                    <td class="moda-table-td text-center">
                      <span class="moda-badge moda-badge-danger">
                        {{ producto.total_vendido || producto.cantidad || 0 }}
                      </span>
                      <div class="moda-unit-text">unidades</div>
                    </td>
                    <td class="moda-table-td text-center moda-amount">
                      {{ formatearMoneda(calcularPrecioUnitario(producto)) }}
                    </td>
                    <td class="moda-table-td text-end fw-bold moda-amount-total">
                      {{ formatearMoneda(calcularTotalProducto(producto)) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- MENSAJE CUANDO NO HAY PRODUCTOS -->
          <div class="moda-empty-state" v-else>
            <i class="bi bi-inbox moda-empty-icon"></i>
            <h5 class="moda-empty-title">No hay productos vendidos en el período seleccionado</h5>
            <p class="moda-empty-subtitle">Intenta cambiar las fechas del reporte</p>
          </div>
        </div>

        <!-- Proyecciones -->
        <div v-else-if="activeReport === 'projection'">
          <div class="moda-report-header mb-4">
            <div>
              <h4 class="moda-report-title">
                <i class="bi bi-graph-up-arrow me-2"></i> ANÁLISIS DE PROYECCIONES
              </h4>
              <p class="moda-report-subtitle">Proyección basada en datos históricos reales</p>
            </div>
          </div>

          <div class="mb-5">
            <h5 class="moda-chart-title mb-3">PROYECCIÓN DE VENTAS</h5>
            <div class="moda-chart-container">
              <Line :data="chartData.salesProjection" :options="chartOptions.salesProjection" />
            </div>
          </div>

          <div class="mb-3">
            <h5 class="moda-chart-title mb-3">NECESIDADES DE INVENTARIO</h5>
            <div class="moda-chart-container">
              <Bar :data="chartData.inventoryNeeds" :options="chartOptions.inventoryNeeds" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin datos seleccionados -->
    <div v-else class="moda-card">
      <div class="moda-card-body text-center py-5">
        <i class="bi bi-database moda-empty-icon moda-text-muted mb-3"></i>
        <h5 class="moda-empty-title">SELECCIONA UN REPORTE</h5>
        <p class="moda-empty-subtitle mb-0">Haz clic en cualquiera de los botones arriba para visualizar datos REALES de tu
          sistema</p>
      </div>
    </div>
  </div>
</template>

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
          backgroundColor: ['#4A3B34', '#8B7355', '#D6CFC8', '#5D4A3A', '#A99276'],
          borderColor: ['#352822', '#6B593D', '#C0B4A9', '#45372C', '#957C5D'],
          borderWidth: 1,
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
          borderColor: '#c82333',
          borderWidth: 1,
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

    // Preparar datos para gráfico
    const productosParaGrafico = [];

    productosReales.forEach(producto => {
      // Obtener nombre
      const nombre = producto.nombre ||
        producto.VarianteProducto?.ProductoPrincipal?.nombre ||
        'Producto sin nombre';

      // Obtener cantidad
      let cantidad = 0;

      if (producto.total_vendido !== undefined) {
        cantidad = Number(producto.total_vendido);
      }
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
            stepSize: 1,
            callback: function (value) {
              return Math.round(value);
            }
          }
        }
      }
    };

    // Datos del gráfico
    if (productosParaGrafico.length === 0) {
      console.warn('⚠️ No hay productos con cantidad > 0');
      chartData.value = null;
    } else {
      chartData.value = {
        labels: productosParaGrafico.map(p => p.nombre),
        datasets: [
          {
            label: 'Cantidad Vendida',
            backgroundColor: '#198754',
            borderColor: '#0d6e2d',
            borderWidth: 2,
            borderRadius: 5,
            data: productosParaGrafico.map(p => p.cantidad)
          }
        ]
      };
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

    // Obtener ventas reales para proyección
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
          borderColor: '#4A3B34',
          backgroundColor: 'rgba(74, 59, 52, 0.2)',
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
          borderColor: '#8B7355',
          backgroundColor: 'rgba(139, 115, 85, 0.4)',
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
          backgroundColor: '#5D4A3A',
          borderColor: '#45372C',
          borderWidth: 1,
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

// Métodos adicionales para productos
const calcularPrecioUnitario = (producto) => {
  const cantidad = producto.total_vendido || producto.cantidad || 1;
  const montoTotal = producto.monto_total || producto.venta_total || 0;

  if (cantidad > 0 && montoTotal > 0) {
    return montoTotal / cantidad;
  }

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

// Clases para ranking
const getRankClass = (index) => {
  if (index === 0) return 'moda-rank-1';
  if (index === 1) return 'moda-rank-2';
  if (index === 2) return 'moda-rank-3';
  return 'moda-rank-other';
};

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
</script>

<style scoped>
/* Contenedor principal */
.moda-main-container {
  background-color: #FFFDFB;
  border-radius: 14px;
  border: 1px solid #D6CFC8;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(74, 59, 52, 0.1);
  margin: 2rem auto;
}

/* Encabezado especial */
.moda-card-header {
  background: linear-gradient(135deg, #4A3B34, #5D4A3A);
  color: white;
}

.moda-card-header .moda-title {
  color: white !important;
}

.moda-card-header .moda-subtitle {
  color: rgba(255, 255, 255, 0.9) !important;
}

.moda-card-header .moda-text-muted {
  color: rgba(255, 255, 255, 0.7) !important;
}

/* Títulos */
.moda-title {
  color: #3A2E2A;
  font-weight: 700;
  font-size: 1.8rem;
}

.moda-icon-danger {
  color: #dc3545;
}

.moda-subtitle {
  color: #8B7355;
  font-weight: 500;
  font-size: 1rem;
}

.moda-text-muted {
  color: #8B7355;
  opacity: 0.8;
}

/* Tarjetas */
.moda-card {
  background-color: #F8F5F2;
  border-radius: 12px;
  border: 1px solid #D6CFC8;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.moda-card:hover {
  box-shadow: 0 4px 12px rgba(74, 59, 52, 0.15);
}

.moda-card-body {
  padding: 1.5rem;
}

/* Inputs y etiquetas */
.moda-label {
  color: #3A2E2A;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.moda-input {
  background-color: white;
  border: 2px solid #D6CFC8;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #3A2E2A;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

.moda-input:focus {
  border-color: #4A3B34;
  box-shadow: 0 0 0 3px rgba(74, 59, 52, 0.2);
  outline: none;
}

/* Botones */
.btn {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
}

.moda-btn-primary {
  background-color: #4A3B34;
  border-color: #4A3B34;
  color: white;
}

.moda-btn-primary:hover:not(:disabled) {
  background-color: #352822;
  border-color: #352822;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 59, 52, 0.3);
}

.moda-btn-outline {
  background-color: transparent;
  border: 2px solid #4A3B34;
  color: #4A3B34;
}

.moda-btn-outline:hover:not(:disabled) {
  background-color: #4A3B34;
  color: white;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Botones de reporte */
.moda-report-btn {
  flex-direction: column;
  height: 100%;
  min-height: 120px;
  transition: all 0.3s ease;
}

.moda-report-btn:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(74, 59, 52, 0.2);
}

.moda-report-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.moda-report-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.moda-report-subtitle {
  color: #8B7355;
  font-size: 0.8rem;
}

/* Spinner */
.moda-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #D6CFC8;
  border-top-color: #4A3B34;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alertas */
.moda-alert {
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.moda-alert-error {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: #dc3545;
  color: #dc3545;
}

.moda-alert-warning {
  background-color: rgba(255, 193, 7, 0.1);
  border-color: #ffc107;
  color: #ffc107;
}

.moda-alert-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

/* Reporte header */
.moda-report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #D6CFC8;
}

.moda-report-title {
  color: #3A2E2A;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
}

.moda-report-subtitle {
  color: #8B7355;
  font-size: 0.9rem;
  margin-bottom: 0;
}

.moda-report-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.moda-stat-item {
  background-color: #4A3B34;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
}

.moda-stat-success {
  background-color: #198754;
}

.moda-stat-subtitle {
  color: #8B7355;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* Contenedor de gráficos */
.moda-chart-container {
  height: 400px;
  position: relative;
}

.moda-chart-title {
  color: #5D4A3A;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Tarjeta de resumen */
.moda-summary-card {
  background-color: white;
  border-radius: 10px;
  border: 1px solid #D6CFC8;
  overflow: hidden;
}

.moda-summary-header {
  background: linear-gradient(135deg, #4A3B34, #5D4A3A);
  color: white;
  padding: 1rem;
  font-weight: 600;
}

.moda-summary-body {
  padding: 1rem;
}

.moda-summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.moda-summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #F8F5F2;
}

.moda-summary-item:last-child {
  border-bottom: none;
}

.moda-amount-total {
  color: #198754;
  font-weight: 600;
}

.moda-amount {
  color: #3A2E2A;
  font-weight: 500;
}

/* Tablas */
.moda-table-card {
  background-color: white;
  border-radius: 10px;
  border: 1px solid #D6CFC8;
  overflow: hidden;
}

.moda-table-header {
  background-color: #F8F5F2;
  padding: 1rem;
  font-weight: 600;
  color: #3A2E2A;
  border-bottom: 1px solid #D6CFC8;
}

.moda-table-container {
  overflow-x: auto;
}

.moda-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.moda-table-th {
  background-color: #F8F5F2;
  color: #3A2E2A;
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid #D6CFC8;
  font-size: 0.85rem;
}

.moda-table-td {
  padding: 0.75rem 1rem;
  color: #3A2E2A;
  border-bottom: 1px solid #F8F5F2;
  vertical-align: middle;
}

.moda-row-even {
  background-color: white;
}

.moda-row-odd {
  background-color: #F8F5F2;
}

.moda-row-even:hover, .moda-row-odd:hover {
  background-color: rgba(139, 115, 85, 0.05);
}

/* Badges */
.moda-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.moda-badge-danger {
  background-color: rgba(220, 53, 69, 0.15);
  color: #dc3545;
}

/* Ranks */
.moda-rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
}

.moda-rank-1 {
  background-color: #FFD700;
  color: #3A2E2A;
}

.moda-rank-2 {
  background-color: #C0C0C0;
  color: #3A2E2A;
}

.moda-rank-3 {
  background-color: #CD7F32;
  color: #3A2E2A;
}

.moda-rank-other {
  background-color: #D6CFC8;
  color: #3A2E2A;
}

/* Información de producto */
.moda-product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.moda-product-icon {
  width: 40px;
  height: 40px;
  background-color: rgba(74, 59, 52, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4A3B34;
  font-size: 1.2rem;
}

.moda-product-details {
  flex: 1;
}

.moda-product-name {
  font-weight: 600;
  color: #3A2E2A;
  margin-bottom: 0.1rem;
  font-size: 0.9rem;
}

.moda-product-code {
  color: #8B7355;
  font-size: 0.8rem;
}

.moda-unit-text {
  color: #8B7355;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Estado vacío */
.moda-empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.moda-empty-icon {
  font-size: 4rem;
  color: #D6CFC8;
  margin-bottom: 1rem;
}

.moda-empty-title {
  color: #3A2E2A;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.moda-empty-subtitle {
  color: #8B7355;
}

/* Títulos de sección */
.moda-section-title {
  color: #3A2E2A;
  font-weight: 600;
  font-size: 1rem;
  border-bottom: 2px solid #D6CFC8;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 992px) {
  .moda-main-container {
    padding: 1.5rem;
  }
  
  .moda-report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .moda-report-stats {
    align-items: flex-start;
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
  
  .moda-report-btn {
    min-height: 100px;
  }
  
  .moda-report-icon {
    font-size: 1.5rem;
  }
  
  .moda-report-title {
    font-size: 0.8rem;
  }
  
  .moda-chart-container {
    height: 300px;
  }
}

@media (max-width: 576px) {
  .row {
    margin: 0 -0.5rem;
  }
  
  .col-md-3, .col-md-4 {
    padding: 0.5rem;
  }
}
</style>