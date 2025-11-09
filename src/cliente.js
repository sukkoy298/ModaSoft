import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // Vite proxy -> backend en localhost:3001
  timeout: 10000
})

export async function verificarServidor() {
  try {
    const res = await api.get('/status') // <-- usar /status que expone server.js
    return res.data
  } catch (err) {
    // devuelve null/false para que el frontend muestre el estado de conexión correcto
    console.error('verificarServidor error:', err.message || err)
    throw err
  }
}

export async function verificarBD() {
  try {
    // intenta un endpoint sencillo o /status si lo tienes
    const res = await api.get('/status').catch(() => null)
    return !!res
  } catch {
    return false
  }
}

export async function obtenerTodosLosClientes() {
  const res = await api.get('/clientes')
  return res.data
}

export async function obtenerClientePorCedula(cedula) {
  const res = await api.get(`/clientes/${cedula}`)
  return res.data
}

export async function agregarCliente(payload) {
  const res = await api.post('/clientes', payload)
  return res.data
}

export async function actualizarCliente(cedula, payload) {
  const res = await api.put(`/clientes/${cedula}`, payload)
  return res.data
}

// alias compatible con imports existentes
export async function editarCliente(cedula, payload) {
  return actualizarCliente(cedula, payload)
}

export async function eliminarCliente(cedula) {
  const res = await api.delete(`/clientes/${cedula}`)
  return res.data
}

export function limpiarClienteAEditar() {
  return {
    cedula: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    tipo: ''
  }
}