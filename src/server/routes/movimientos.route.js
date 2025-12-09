import express from 'express';
import { obtenerMovimientos, registrarMovimiento } from '../services/movimiento.service.js';

const router = express.Router();

// GET /api/movimientos - listar movimientos (opcional filtro por fecha)
router.get('/', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const movimientos = await obtenerMovimientos(fecha_inicio, fecha_fin);
    res.json({ success: true, data: movimientos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/movimientos - crear movimiento contable manual
router.post('/', async (req, res) => {
  try {
    const movimiento = await registrarMovimiento(req.body);
    res.status(201).json({ success: true, data: movimiento });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
