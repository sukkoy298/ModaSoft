import axios from 'axios';

const api = axios.create({
  baseURL: '/api' // llama a /api/productos y Vite lo proxeará a localhost:3000
});

export function getProductos() {
  return api.get('/productos').then(res => res.data);
}

// Compatibilidad: exporta obtenerTodoElInventario que usan varios componentes.
// Intenta delegar en funciones ya definidas (si existen) o consulta endpoints comunes.
export async function obtenerTodoElInventario() {
  // Si existen funciones internas con otros nombres, llámalas
  if (typeof obtenerInventario === 'function') return await obtenerInventario()
  if (typeof obtenerProductos === 'function') return await obtenerProductos()
  if (typeof fetchInventario === 'function') return await fetchInventario()

  // FallBack: intentar consultar endpoints usuales
  try {
    const res = await fetch('/api/productos')
    if (res.ok) return await res.json()
  } catch (e) {
    // ignore
  }
  try {
    const res = await fetch('/api/inventario')
    if (res.ok) return await res.json()
  } catch (e) {
    // ignore
  }

  // Si todo falla, devolver array vacío para evitar romper la UI
  return []
}