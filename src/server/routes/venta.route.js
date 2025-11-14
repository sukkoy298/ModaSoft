// src/server/routes/venta.route.js
import { Router } from 'express'
import { 
  obtenerTodasLasVentasDB, 
  obtenerVentaPorIdDB, 
  eliminarVentaDB,
  registrarVenta // ← ¡IMPORTANTE! Esta función debe existir
} from '../../venta.service.js'

const router = Router()

// GET /api/ventas - Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const ventas = await obtenerTodasLasVentasDB()
    res.status(200).json(ventas)
  } catch (error) {
    console.error('Error en GET /api/ventas:', error)
    res.status(500).json({ error: 'Error interno del servidor', message: error.message })
  }
})

// POST /api/ventas - Registrar nueva venta ✅ 
router.post('/', async (req, res) => {
  try {
    console.log('📥 Datos recibidos para venta:', req.body)
    const nuevaVenta = await registrarVenta(req.body)
    res.status(201).json(nuevaVenta)
  } catch (error) {
    console.error('Error en POST /api/ventas:', error)
    res.status(500).json({ error: 'Error al registrar la venta', message: error.message })
  }
})

// GET /api/ventas/:id - Obtener una venta específica
router.get('/:id', async (req, res) => {
  try {
    const venta = await obtenerVentaPorIdDB(parseInt(req.params.id))
    res.status(200).json(venta)
  } catch (error) {
    if (error.message === 'Venta no encontrada') {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message })
    }
  }
})

// DELETE /api/ventas/:id - Anular una venta
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await eliminarVentaDB(parseInt(req.params.id))
    res.status(200).json(resultado)
  } catch (error) {
    if (error.message === 'Venta no encontrada') {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message })
    }
  }
})

export default router