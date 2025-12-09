import express from 'express';
import {
  obtenerTodasLasCompras,
  obtenerCompraPorId,
  registrarCompra,
  obtenerComprasPorProveedor,
  obtenerComprasPorFecha,
  eliminarCompra,
  obtenerComprasHoy,
  obtenerComprasEsteMes
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

// GET /api/compras/hoy - Obtener compras de hoy
router.get('/hoy', async (req, res) => {
  try {
    const compras = await obtenerComprasHoy();
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/compras/mes - Obtener compras del mes
router.get('/mes', async (req, res) => {
  try {
    const compras = await obtenerComprasEsteMes();
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/compras/:id_compra - Obtener compra por ID
router.get('/:id_compra', async (req, res) => {
  try {
    const compra = await obtenerCompraPorId(req.params.id_compra);
    res.json(compra);
  } catch (error) {
    res.status(404).json({ message: error.message });
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

// GET /api/compras/proveedor/:cedula_proveedor - Obtener compras por proveedor
router.get('/proveedor/:cedula_proveedor', async (req, res) => {
  try {
    const compras = await obtenerComprasPorProveedor(req.params.cedula_proveedor);
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/compras/filtro/fecha - Obtener compras por rango de fecha
router.get('/filtro/fecha', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const compras = await obtenerComprasPorFecha(fecha_inicio, fecha_fin);
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/compras/:id_compra - Eliminar compra
router.delete('/:id_compra', async (req, res) => {
  try {
    const resultado = await eliminarCompra(req.params.id_compra);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;