<template>
  <Header />
  <div class="container mt-4 mb-5">
    <div class="moda-container">
      <!-- Encabezado -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="moda-title mb-0">Reportes Contables</h3>
        <div class="btn-group" role="group">
          <button class="btn btn-moda-outline" @click="exportarReporte">
            <i class="bi bi-download me-2"></i>Exportar
          </button>
          <button class="btn btn-moda-primary" @click="filtrarMovimientos">
            <i class="bi bi-funnel me-2"></i>Filtrar
          </button>
        </div>
      </div>
      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-moda-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2 text-muted">Cargando movimientos...</p>
      </div>
      <!-- Tarjetas de resumen -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="moda-card p-3">
            <div class="d-flex align-items-center">
              <div class="moda-icon-circle bg-success">
                <i class="bi bi-arrow-up-right text-white"></i>
              </div>
              <div class="ms-3">
                <div class="text-muted small">Total Débitos</div>
                <div class="h4 fw-bold text-success">{{ formatoMoneda(totalDebe) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="moda-card p-3">
            <div class="d-flex align-items-center">
              <div class="moda-icon-circle bg-danger">
                <i class="bi bi-arrow-down-right text-white"></i>
              </div>
              <div class="ms-3">
                <div class="text-muted small">Total Créditos</div>
                <div class="h4 fw-bold text-danger">{{ formatoMoneda(totalHaber) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="moda-card p-3">
            <div class="d-flex align-items-center">
              <div class="moda-icon-circle bg-primary">
                <i class="bi bi-calculator text-white"></i>
              </div>
              <div class="ms-3">
                <div class="text-muted small">Diferencia</div>
                <div class="h4 fw-bold" :class="diferencia >= 0 ? 'text-success' : 'text-danger'">
                  {{ formatoMoneda(diferencia) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="moda-card p-3">
            <div class="d-flex align-items-center">
              <div class="moda-icon-circle bg-secondary">
                <i class="bi bi-calendar text-white"></i>
              </div>
              <div class="ms-3">
                <div class="text-muted small">Movimientos</div>
                <div class="h4 fw-bold text-moda-dark">{{ movimientos.length }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="moda-card p-4 mb-4">
        <h6 class="moda-subtitle mb-3">Filtros de Reporte</h6>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label small text-muted">Fecha Desde</label>
            <input type="date" class="form-control moda-input" v-model="filtros.fechaDesde">
          </div>
          <div class="col-md-3">
            <label class="form-label small text-muted">Fecha Hasta</label>
            <input type="date" class="form-control moda-input" v-model="filtros.fechaHasta">
          </div>
          <div class="col-md-3">
            <label class="form-label small text-muted">Cuenta Contable</label>
            <select class="form-select moda-input" v-model="filtros.cuenta">
              <option value="">Todas las cuentas</option>
              <option v-for="cuenta in cuentasUnicas" :key="cuenta" :value="cuenta">
                {{ cuenta }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small text-muted">Tipo de Movimiento</label>
            <select class="form-select moda-input" v-model="filtros.tipo">
              <option value="">Todos</option>
              <option value="debe">Débito</option>
              <option value="haber">Crédito</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de movimientos -->
      <div class="moda-card p-0 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover table-moda mb-0">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cuenta</th>
                <th>Descripción</th>
                <th class="text-end">Débito</th>
                <th class="text-end">Crédito</th>
                <th class="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in movimientosFiltrados" :key="m.id_movimiento">
                <td>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-calendar-date me-2 moda-icon"></i>
                    {{ formatoFecha(m.fecha_movimiento) }}
                  </div>
                </td>
                <td>
                  <span class="badge badge-moda" :title="nombreCuenta(m.codigo_cuenta)">
                    {{ nombreCuenta(m.codigo_cuenta) }}
                  </span>
                </td>
                <td>
                  <div class="text-truncate" style="max-width: 200px;" :title="m.descripcion">
                    {{ m.descripcion }}
                  </div>
                </td>
                <td class="text-end">
                  <span v-if="m.debe > 0" class="text-success fw-semibold">
                    {{ formatoMoneda(m.debe) }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-end">
                  <span v-if="m.haber > 0" class="text-danger fw-semibold">
                    {{ formatoMoneda(m.haber) }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-center">
                  <span class="badge" :class="getEstadoClass(m)">
                    {{ getEstadoText(m) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Resumen al final de la tabla -->
        <div class="border-top p-3 bg-light">
          <div class="row">
            <div class="col-md-4">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Total Débitos:</span>
                <span class="text-success fw-bold">{{ formatoMoneda(totalDebeFiltrado) }}</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Total Créditos:</span>
                <span class="text-danger fw-bold">{{ formatoMoneda(totalHaberFiltrado) }}</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Balance:</span>
                <span class="fw-bold" :class="balanceFiltrado >= 0 ? 'text-success' : 'text-danger'">
                  {{ formatoMoneda(balanceFiltrado) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin resultados -->
        <div v-if="movimientosFiltrados.length === 0" class="text-center py-5">
          <i class="bi bi-graph-up-arrow fs-1 text-muted mb-3 d-block"></i>
          <h5 class="moda-subtitle">No hay movimientos para mostrar</h5>
          <p class="text-muted mb-0">
            Intenta ajustar los filtros o no hay datos para el período seleccionado
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { obtenerMovimientos } from '../movimiento.js'
import { obtenerCatalogoCuentas } from '../catalogoCuentas.js'
import Header from '@/components/Header.vue'

const catalogoCuentas = ref([])
const movimientos = ref([])
const cargando = ref(false)
const filtros = ref({
  fechaDesde: '',
  fechaHasta: '',
  cuenta: '',
  tipo: ''
})

const cargar = async () => {
  cargando.value = true;
  try {
    const params = {}
    if (filtros.value.fechaDesde) params.fecha_inicio = filtros.value.fechaDesde
    if (filtros.value.fechaHasta) params.fecha_fin = filtros.value.fechaHasta
    if (filtros.value.cuenta) params.codigo_cuenta = filtros.value.cuenta
    if (filtros.value.tipo) params.tipo = filtros.value.tipo

    // Cargar movimientos y catálogo en paralelo
    const [movimientosData, cuentasData] = await Promise.all([
      obtenerMovimientos(params),
      obtenerCatalogoCuentas()
    ])

    movimientos.value = Array.isArray(movimientosData) ? movimientosData : []
    catalogoCuentas.value = Array.isArray(cuentasData) ? cuentasData : []

    console.log('Movimientos cargados:', movimientos.value.length)
    console.log('Cuentas cargadas:', catalogoCuentas.value.length)

  } catch (error) {
    console.error('Error al cargar datos:', error)
    movimientos.value = []
    catalogoCuentas.value = []
  } finally {
    cargando.value = false
  }
}

const nombreCuenta = (codigo) => {
  const cuenta = catalogoCuentas.value.find(c => c.codigo === codigo)
  return cuenta ? `${cuenta.codigo} - ${cuenta.nombre}` : codigo
}
watch(
  () => filtros.value,
  () => {
    cargar()
  },
  { deep: true, immediate: false }
)
const agregarLoader = () => {
  return `
        <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border text-moda-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 text-muted">Cargando movimientos...</p>
        </div>
    `
}

// Computeds
const totalDebe = computed(() => {
  return movimientos.value.reduce((sum, m) => sum + (parseFloat(m.debe) || 0), 0)
})

const totalHaber = computed(() => {
  return movimientos.value.reduce((sum, m) => sum + (parseFloat(m.haber) || 0), 0)
})

const diferencia = computed(() => totalDebe.value - totalHaber.value)

const cuentasUnicas = computed(() => {
  const cuentas = new Set()
  movimientos.value.forEach(m => cuentas.add(m.codigo_cuenta))
  return Array.from(cuentas).sort()
})

const movimientosFiltrados = computed(() => {
  let filtrados = movimientos.value

  // Filtrar por fecha
  if (filtros.value.fechaDesde) {
    filtrados = filtrados.filter(m =>
      new Date(m.fecha_movimiento) >= new Date(filtros.value.fechaDesde)
    )
  }

  if (filtros.value.fechaHasta) {
    filtrados = filtrados.filter(m =>
      new Date(m.fecha_movimiento) <= new Date(filtros.value.fechaHasta)
    )
  }

  // Filtrar por cuenta
  if (filtros.value.cuenta) {
    filtrados = filtrados.filter(m =>
      m.codigo_cuenta === filtros.value.cuenta
    )
  }

  // Filtrar por tipo
  if (filtros.value.tipo === 'debe') {
    filtrados = filtrados.filter(m => m.debe > 0)
  } else if (filtros.value.tipo === 'haber') {
    filtrados = filtrados.filter(m => m.haber > 0)
  }

  return filtrados
})

const totalDebeFiltrado = computed(() => {
  return movimientosFiltrados.value.reduce((sum, m) => sum + (parseFloat(m.debe) || 0), 0)
})

const totalHaberFiltrado = computed(() => {
  return movimientosFiltrados.value.reduce((sum, m) => sum + (parseFloat(m.haber) || 0), 0)
})

const balanceFiltrado = computed(() => totalDebeFiltrado.value - totalHaberFiltrado.value)

// Métodos
const formatoFecha = (fecha) => {
  if (!fecha) return ''
  // Si la fecha es string 'YYYY-MM-DD', le agregamos hora local para evitar conversión a UTC anterior
  if (typeof fecha === 'string' && fecha.length === 10) {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD'
  }).format(valor)
}

const getEstadoClass = (movimiento) => {
  if (movimiento.debe > 0 && movimiento.haber === 0) {
    return 'bg-success bg-opacity-10 text-success'
  } else if (movimiento.haber > 0 && movimiento.debe === 0) {
    return 'bg-danger bg-opacity-10 text-danger'
  } else {
    return 'bg-secondary bg-opacity-10 text-secondary'
  }
}

const getEstadoText = (movimiento) => {
  if (movimiento.debe > 0 && movimiento.haber === 0) {
    return 'Débito'
  } else if (movimiento.haber > 0 && movimiento.debe === 0) {
    return 'Crédito'
  } else {
    return 'Mixto'
  }
}

const exportarReporte = () => {
  // Generar CSV a partir de movimientosFiltrados
  const filas = movimientosFiltrados.value
  if (!filas.length) {
    alert('No hay datos para exportar')
    return
  }

  const header = ['fecha_movimiento', 'codigo_cuenta', 'descripcion', 'debe', 'haber']
  const csv = [header.join(',')]
  filas.forEach(f => {
    const row = [
      `"${f.fecha_movimiento}"`,
      `"${f.codigo_cuenta}"`,
      `"${(f.descripcion || '').replace(/"/g, '""')}"`,
      f.debe || 0,
      f.haber || 0
    ]
    csv.push(row.join(','))
  })

  const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reporte_contable_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const filtrarMovimientos = () => {
  // La lógica ya está en los computeds
  console.log('Filtrando movimientos...')
}

onMounted(() => cargar())
</script>

<style scoped>
.moda-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.bg-success.bg-opacity-10 {
  background-color: rgba(25, 135, 84, 0.1) !important;
}

.bg-danger.bg-opacity-10 {
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.bg-secondary.bg-opacity-10 {
  background-color: rgba(108, 117, 125, 0.1) !important;
}

.table-moda th:nth-child(4),
.table-moda td:nth-child(4),
.table-moda th:nth-child(5),
.table-moda td:nth-child(5) {
  width: 120px;
}

.table-moda th:last-child,
.table-moda td:last-child {
  width: 100px;
}

.badge {
  padding: 0.35em 0.65em;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 500;
}
</style>