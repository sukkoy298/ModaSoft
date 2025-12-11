import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

// Función para obtener todo el inventario
export const obtenerTodoElInventario = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos/inventario`)
    return response.data
  } catch (error) {
    console.error('Error cargando inventario:', error)

    // Si falla, intentar la ruta alternativa
    try {
      const response = await axios.get(`${API_URL}/productos`)
      return response.data
    } catch (fallbackError) {
      console.error('Error en ruta alternativa:', fallbackError)
      throw new Error('No se pudo cargar el inventario')
    }
  }
}

// Función para buscar cliente por cédula (si no está en cliente.js)
export const buscarClientePorCedula = async (cedula) => {
  try {
    const response = await axios.get(`${API_URL}/clientes/cedula/${cedula}`)
    return response.data
  } catch (error) {
    console.error('Error buscando cliente:', error)
    throw error
  }
}

// Función para obtener métodos de pago
export const obtenerMetodosPago = async () => {
  try {
    const response = await axios.get(`${API_URL}/metodos-pago`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo métodos de pago:', error)
    throw error
  }
}

// === Nuevas funciones para ModalNuevoProducto ===

export const obtenerCategorias = async () => {
  const response = await axios.get(`${API_URL}/categorias`)
  return response.data
}

export const obtenerMarcas = async () => {
  const response = await axios.get(`${API_URL}/marcas`)
  return response.data
}

export const registrarProductoPrincipal = async (productoData) => {
  const response = await axios.post(`${API_URL}/productos`, productoData)
  return response.data
}

export const registrarVariante = async (varianteData) => {
  // Asegurarse de que varianteData tenga id_producto, sku, talla, color, precio_venta, stock_actual
  const response = await axios.post(`${API_URL}/productos/variantes`, varianteData)
  return response.data
}