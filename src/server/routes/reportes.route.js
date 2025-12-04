import express from 'express';
import {
  obtenerTopClientes,
  obtenerClientesPorTipo,
  obtenerHistorialComprasCliente
} from '../services/reportes.service.js';

const router = express.Router();

// GET /api/reportes/clientes/top - Obtener top clientes
router.get('/clientes/top', async (req, res) => {
  try {
    const { limite, fechaInicio, fechaFin } = req.query;
    const clientes = await obtenerTopClientes(limite, fechaInicio, fechaFin);
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reportes/clientes/por-tipo - Obtener clientes por tipo
router.get('/clientes/por-tipo', async (req, res) => {
  try {
    const { tipo } = req.query;
    const clientes = await obtenerClientesPorTipo(tipo);
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reportes/clientes/historial/:cedula - Obtener historial de compras
router.get('/clientes/historial/:cedula', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await obtenerHistorialComprasCliente(req.params.cedula, fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;