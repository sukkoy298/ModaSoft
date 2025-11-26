import express from 'express';
import {
  obtenerTodosLosMetodosPago,
  obtenerMetodoPagoPorId,
  registrarMetodoPago,
  actualizarMetodoPago,
  eliminarMetodoPago
} from '../services/metodoPago.service.js';

const router = express.Router();

// GET /api/metodos-pago - Obtener todos los métodos de pago
router.get('/', async (req, res) => {
  try {
    const metodosPago = await obtenerTodosLosMetodosPago();
    res.json(metodosPago);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/metodos-pago/:id - Obtener método de pago por ID
router.get('/:id', async (req, res) => {
  try {
    const metodoPago = await obtenerMetodoPagoPorId(req.params.id);
    if (!metodoPago) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }
    res.json(metodoPago);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/metodos-pago - Registrar nuevo método de pago
router.post('/', async (req, res) => {
  try {
    const nuevoMetodoPago = await registrarMetodoPago(req.body);
    res.status(201).json(nuevoMetodoPago);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/metodos-pago/:id - Actualizar método de pago
router.put('/:id', async (req, res) => {
  try {
    const metodoPagoActualizado = await actualizarMetodoPago(req.params.id, req.body);
    res.json(metodoPagoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/metodos-pago/:id - Eliminar método de pago
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await eliminarMetodoPago(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;