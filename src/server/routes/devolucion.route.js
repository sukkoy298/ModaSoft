import express from 'express';
import {
  obtenerTodasLasDevoluciones,
  obtenerDevolucionPorId,
  registrarDevolucion,
  obtenerDevolucionesPorVenta
} from '../services/devolucion.service.js';

const router = express.Router();

// GET /api/devoluciones - Obtener todas las devoluciones
router.get('/', async (req, res) => {
  try {
    const devoluciones = await obtenerTodasLasDevoluciones();
    res.json(devoluciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/devoluciones/:id - Obtener devolución por ID
router.get('/:id', async (req, res) => {
  try {
    const devolucion = await obtenerDevolucionPorId(req.params.id);
    if (!devolucion) {
      return res.status(404).json({ message: 'Devolución no encontrada' });
    }
    res.json(devolucion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/devoluciones - Registrar nueva devolución
router.post('/', async (req, res) => {
  try {
    const nuevaDevolucion = await registrarDevolucion(req.body);
    res.status(201).json(nuevaDevolucion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/devoluciones/venta/:id_venta - Obtener devoluciones por venta
router.get('/venta/:id_venta', async (req, res) => {
  try {
    const devoluciones = await obtenerDevolucionesPorVenta(req.params.id_venta);
    res.json(devoluciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;