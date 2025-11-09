import { Router } from 'express'
import { obtenerTodoElInventario } from '../../producto.service.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    console.log('[API] GET /api/productos - inicio')
    const productos = await obtenerTodoElInventario()
    console.log(`[API] GET /api/productos - ok, ${productos.length} registros`)
    return res.json(productos)
  } catch (err) {
    console.error('[API] GET /api/productos - ERROR:', err && err.stack ? err.stack : err)
    return res.status(500).json({
      message: 'Error al obtener el inventario',
      error: err.message || 'No se pudo obtener la lista de inventario.'
    })
  }
})

export default router