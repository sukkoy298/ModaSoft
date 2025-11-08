import express from 'express';
import {
  obtenerTodasLasCompras,
  obtenerCompraPorId,
  registrarCompra,
  obtenerComprasPorProveedor
} from '../services/compra.service.js';

const router = express.Router();

// GET /api/compras - Obtener todas las compras
router.get('/', async (req, res) => {
  try {
    const compras = await obtenerTodasLasCompras();
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/compras/:id - Obtener compra por ID
router.get('/:id', async (req, res) => {
  try {
    const compra = await obtenerCompraPorId(req.params.id);
    if (!compra) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }
    res.json(compra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/compras - Registrar nueva compra
router.post('/', async (req, res) => {
  try {
    const nuevaCompra = await registrarCompra(req.body);
    res.status(201).json(nuevaCompra);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/compras/proveedor/:doc_identidad - Obtener compras por proveedor
router.get('/proveedor/:doc_identidad', async (req, res) => {
  try {
    const compras = await obtenerComprasPorProveedor(req.params.doc_identidad);
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;