import express from 'express';
import {
  registrarProducto,
  registrarVarianteProducto,
  obtenerProductosPrincipales,
  obtenerTodasLasVariantes,
  actualizarStockVariante
} from '../services/producto.service.js';
import { obtenerTodasLasCategorias } from '../services/categoria.service.js';

const router = express.Router();

// PRODUCTOS PRINCIPALES
// GET /api/productos/principales - Obtener productos principales
router.get('/principales', async (req, res) => {
  try {
    const productos = await obtenerProductosPrincipales();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/productos/principales - Registrar producto principal
router.post('/principales', async (req, res) => {
  try {
    const nuevoProducto = await registrarProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET para obtener variantes
router.get('/variantes', async (req, res) => {
  try {
    const variantes = await obtenerTodasLasVariantes();
    res.json(variantes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/variantes/:id - Obtener variante por ID
router.get('/variantes/:id', async (req, res) => {
  try {
    const variante = await obtenerVariantePorId(req.params.id);
    if (!variante) {
      return res.status(404).json({ message: 'Variante no encontrada' });
    }
    res.json(variante);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VARIANTES DE PRODUCTO
// POST /api/productos/variantes - Registrar variante de producto
router.post('/variantes', async (req, res) => {
  try {
    const nuevaVariante = await registrarVarianteProducto(req.body);
    res.status(201).json(nuevaVariante);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// STOCK
// PUT /api/productos/stock/:codigoBarras - Actualizar stock
router.put('/stock/:codigoBarras', async (req, res) => {
  try {
    const { cantidad } = req.body;
    const resultado = await actualizarStockVariante(req.params.codigoBarras, cantidad);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CATEGORÍAS
// GET /api/productos/categorias - Obtener todas las categorías
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await obtenerTodasLasCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;