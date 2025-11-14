<template>
  <div class="consulta-venta">
    <div class="header">
      <h2>Consultando Venta ID: {{ id_venta }}</h2>
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
      <!-- Muestra la información de la venta aquí -->
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
        </div>
      </div>

      <div class="seccion-acciones">
        <button @click="volver" class="btn-volver">Volver a Lista</button>
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
  name: 'ConsultaVenta',
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
    console.log('🆔 ID de venta recibido en ConsultaVenta:', this.id_venta)
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
        console.log('🔍 Cargando venta ID:', this.id_venta)
        this.venta = await obtenerVentaPorId(this.id_venta)
        console.log('✅ Venta cargada correctamente')
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
.consulta-venta {
  padding: 20px;
  max-width: 800px;
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

.btn-volver, .btn-reintentar {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.btn-volver:hover, .btn-reintentar:hover {
  background: #5a6268;
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