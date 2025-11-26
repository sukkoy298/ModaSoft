import express from 'express';
import {
  registrarVenta,
  obtenerTodasLasVentas,
  obtenerVentaPorId,
  anularVenta,
  obtenerVentasPorFecha,
  obtenerDetalleVenta
} from '../services/venta.service.js';

const router = express.Router();

// GET /api/ventas - Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const ventas = await obtenerTodasLasVentas();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/ventas/:id - Obtener venta por ID
router.get('/:id', async (req, res) => {
  try {
    const venta = await obtenerVentaPorId(req.params.id);
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/ventas/:id/detalle - Obtener detalle completo de venta
router.get('/:id/detalle', async (req, res) => {
  try {
    const detalle = await obtenerDetalleVenta(req.params.id);
    if (!detalle) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ventas - Registrar nueva venta
router.post('/', async (req, res) => {
  try {
    const nuevaVenta = await registrarVenta(req.body);
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/ventas/:id/anular - Anular venta
router.put('/:id/anular', async (req, res) => {
  try {
    const ventaAnulada = await anularVenta(req.params.id);
    res.json(ventaAnulada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/ventas/fecha/:fecha - Obtener ventas por fecha
router.get('/fecha/:fecha', async (req, res) => {
  try {
    const ventas = await obtenerVentasPorFecha(req.params.fecha);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;