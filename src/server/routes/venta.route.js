import express from 'express';
import { registrarVenta, obtenerHistorialVentas, obtenerVentaPorId } from '../services/venta.service.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';

const router = express.Router();

// POST /api/ventas - registrar venta
router.post('/', authenticateToken, authorizeRoles([1,2]), async (req, res) => {
  try {
    const payload = req.body;
    const result = await registrarVenta(payload);
    return res.status(201).json({ message: 'Venta registrada', ...result });
  } catch (err) {
    console.error('POST /api/ventas ERROR:', err);
    return res.status(500).json({ message: err.message || 'Error al registrar la venta' });
  }
});

// GET /api/ventas - obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const ventas = await obtenerHistorialVentas();
    return res.json(ventas);
  } catch (err) {
    console.error('GET /api/ventas ERROR:', err);
    return res.status(500).json({ message: err.message || 'Error al obtener ventas' });
  }
});

// GET /api/ventas/:id - obtener venta por id
router.get('/:id', async (req, res) => {
  try {
    const venta = await obtenerVentaPorId(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });
    return res.json(venta);
  } catch (err) {
    console.error('GET /api/ventas/:id ERROR:', err);
    return res.status(500).json({ message: err.message || 'Error al obtener venta' });
  }
});

export default router;