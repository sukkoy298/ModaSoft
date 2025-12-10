import axios from 'axios'

export async function obtenerMovimientos(params = {}) {
  try {
    const res = await axios.get('/api/movimientos', { params })
    // API responde { success: true, data: [...] } o simplemente [...]
    let movimientos = Array.isArray(res.data) ? res.data : res.data?.data
    if (!Array.isArray(movimientos)) movimientos = []
    return movimientos
  } catch (err) {
    console.error('Error obtenerMovimientos:', err)
    return [] // Devuelve array vacío en error para evitar crash en el componente
  }
}

export async function crearMovimiento(payload) {
  try {
    const res = await axios.post('/api/movimientos', payload)
    return res.data
  } catch (err) {
    console.error('Error crearMovimiento:', err)
    throw err
  }
}
