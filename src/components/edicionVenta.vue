<template>
  <div class="edicion-venta">
    <div class="header">
      <h2>Editando Venta ID: {{ id_venta }}</h2>
      <button @click="volver" class="btn-volver">← Volver</button>
    </div>

    <div v-if="cargando" class="cargando">
      <p>Cargando venta...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>❌ {{ error }}</p>
      <button @click="cargarVenta" class="btn-reintentar">Reintentar</button>
    </div>

    <div v-else-if="venta" class="contenido-venta">
      <!-- Información Principal de la Venta -->
      <div class="seccion">
        <h3>Información de la Venta</h3>
        <div class="grid-info">
          <div class="info-item">
            <label>ID Venta:</label>
            <span>{{ venta.id_venta }}</span>
          </div>
          <div class="info-item">
            <label>Fecha:</label>
            <span>{{ formatFecha(venta.fecha) }}</span>
          </div>
          <div class="info-item">
            <label>Total:</label>
            <span>${{ venta.total }}</span>
          </div>
          <div class="info-item">
            <label>Estado:</label>
            <span class="estado" :class="venta.estado">{{ venta.estado }}</span>
          </div>
          <div class="info-item">
            <label>Vendedor:</label>
            <span>{{ venta.usuario?.usuario }}</span>
          </div>
        </div>
      </div>

      <!-- Información del Cliente -->
      <div class="seccion">
        <h3>Información del Cliente</h3>
        <div class="grid-info">
          <div class="info-item">
            <label>Cédula:</label>
            <span>{{ venta.cliente?.cedula }}</span>
          </div>
          <div class="info-item">
            <label>Nombre:</label>
            <span>{{ venta.cliente?.nombre }}</span>
          </div>
          <div class="info-item">
            <label>Email:</label>
            <span>{{ venta.cliente?.email }}</span>
          </div>
          <div class="info-item">
            <label>Teléfono:</label>
            <span>{{ venta.cliente?.telefono }}</span>
          </div>
          <div class="info-item">
            <label>Dirección:</label>
            <span>{{ venta.cliente?.direccion }}</span>
          </div>
        </div>
      </div>

      <!-- Detalles de la Venta -->
      <div class="seccion">
        <h3>Productos Vendidos</h3>
        <div class="tabla-detalles">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Variante</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detalle in venta.DetalleVenta" :key="detalle.id_detalleventa">
                <td>{{ detalle.VarianteProducto?.Producto?.nombre }}</td>
                <td>{{ detalle.VarianteProducto?.codigo_barras }}</td>
                <td>{{ detalle.VarianteProducto?.talla }}</td>
                <td>{{ detalle.VarianteProducto?.color }}</td>
                <td>{{ detalle.cantidad }}</td>
                <td>${{ detalle.precio_unitario_venta }}</td>
                <td>${{ (detalle.cantidad * parseFloat(detalle.precio_unitario_venta)).toFixed(2) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" class="total-text">TOTAL:</td>
                <td class="total-amount">${{ venta.total }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Acciones -->
      <div class="seccion-acciones">
        <button @click="guardarCambios" class="btn-guardar">Guardar Cambios</button>
        <button @click="cancelar" class="btn-cancelar">Cancelar</button>
      </div>
    </div>

    <div v-else class="no-data">
      <p>No se encontraron datos de la venta</p>
    </div>
  </div>
</template>

<script>
import { obtenerVentaPorId } from '@/venta.js'

export default {
  name: 'EdicionVenta',
  props: {
    id_venta: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      cargando: false,
      venta: null,
      error: null
    }
  },
  mounted() {
    console.log('🆔 ID de venta recibido en EdicionVenta:', this.id_venta)
    this.cargarVenta()
  },
  methods: {
    async cargarVenta() {
      if (!this.id_venta) {
        this.error = 'No se recibió ID de venta'
        return
      }
      
      this.cargando = true
      this.error = null
      this.venta = null
      
      try {
        console.log('🔍 Cargando venta para edición ID:', this.id_venta)
        this.venta = await obtenerVentaPorId(this.id_venta)
        console.log('✅ Venta cargada correctamente:', this.venta)
      } catch (error) {
        console.error('❌ Error cargando venta:', error)
        this.error = 'Error al cargar la venta: ' + (error.message || 'Error desconocido')
      } finally {
        this.cargando = false
      }
    },

    formatFecha(fecha) {
      if (!fecha) return ''
      return new Date(fecha).toLocaleDateString('es-ES')
    },

    guardarCambios() {
      console.log('💾 Guardando cambios para venta:', this.venta)
      alert('Funcionalidad de guardar en desarrollo')
    },

    cancelar() {
      this.volver()
    },

    volver() {
      this.$router.push('/listaVentas')
    }
  },
  watch: {
    id_venta: {
      handler(newVal) {
        if (newVal) {
          console.log('🔄 ID de venta cambiado:', newVal)
          this.cargarVenta()
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.edicion-venta {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 15px;
}

.seccion {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.seccion h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.grid-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-item label {
  font-weight: bold;
  color: #555;
}

.estado {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: bold;
}

.estado.pagada {
  background: #d4edda;
  color: #155724;
}

.estado.pendiente {
  background: #fff3cd;
  color: #856404;
}

.tabla-detalles {
  overflow-x: auto;
  margin-top: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f5f5f5;
  font-weight: bold;
}

tfoot {
  background: #f8f9fa;
  font-weight: bold;
}

.total-text {
  text-align: right;
}

.total-amount {
  font-size: 1.1em;
  color: #28a745;
}

.seccion-acciones {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.btn-volver, .btn-cancelar, .btn-reintentar {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.btn-guardar {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-volver:hover, .btn-cancelar:hover, .btn-reintentar:hover {
  background: #5a6268;
}

.btn-guardar:hover {
  background: #218838;
}

.cargando, .error, .no-data {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

.error {
  color: #dc3545;
}
</style>