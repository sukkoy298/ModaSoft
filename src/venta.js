// src/venta.js
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000
})

// Obtener todas las ventas con información de cliente y usuario
export async function obtenerHistorialVentas() {
  try {
    console.log('🔄 Obteniendo historial de ventas...')
    const res = await api.get('/ventas')
    console.log('✅ Ventas obtenidas:', res.data.length, 'ventas')
    return res.data
  } catch (error) {
    console.error('❌ Error obteniendo ventas:', error.response?.data || error.message)
    throw error
  }
}

// Obtener una venta específica con sus detalles
export async function obtenerVentaPorId(idVenta) {
  try {
    console.log('🔍 Obteniendo venta ID:', idVenta)
    const res = await api.get(`/ventas/${idVenta}`)
    console.log('✅ Venta encontrada:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ Error obteniendo venta:', error.response?.data || error.message)
    throw error
  }
}

// Eliminar una venta (anular)
export async function eliminarVenta(idVenta) {
  try {
    console.log('🗑️ Eliminando venta ID:', idVenta)
    const res = await api.delete(`/ventas/${idVenta}`)
    console.log('✅ Venta eliminada:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ Error eliminando venta:', error.response?.data || error.message)
    throw error
  }
}

// Registrar una nueva venta
export async function registrarVenta(ventaData) {
  try {
    console.log('💰 Registrando nueva venta:', ventaData)
    const res = await api.post('/ventas', ventaData)
    console.log('✅ Venta registrada:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ Error registrando venta:', error.response?.data || error.message)
    throw error
  }
}
