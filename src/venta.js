import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const registrarVenta = async (ventaData) => {
  try {
    const response = await axios.post(`${API_URL}/ventas`, ventaData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error en registrarVenta:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error.response) {
      throw new Error(`Error ${error.response.status}: ${error.response.statusText}`)
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor. Verifique que el servidor esté ejecutándose.')
    } else {
      throw new Error('Error al configurar la petición')
    }
  }
}

export const obtenerVentas = async () => {
  try {
    const response = await axios.get(`${API_URL}/ventas`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo ventas:', error)
    throw error
  }
}

export const obtenerVentaPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/ventas/${id}`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo venta:', error)
    throw error
  }
}

export const obtenerMetodosPago = async () => {
  try {
    const response = await axios.get(`${API_URL}/metodos-pago`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo métodos de pago:', error)
    throw error
  }
}