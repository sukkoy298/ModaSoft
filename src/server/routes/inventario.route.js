import express from 'express';
import {
  obtenerTodoElInventario,
  obtenerInventarioPorVariante,
  actualizarStock,
  ajustarStock,
  obtenerProductosBajoStock,
  obtenerMovimientosInventario
} from '../services/inventario.service.js';

const router = express.Router();

// GET /api/inventario - Obtener todo el inventario
router.get('/', async (req, res) => {
  try {
    const inventario = await obtenerTodoElInventario();
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/inventario/bajo-stock - Obtener productos con stock bajo
router.get('/bajo-stock', async (req, res) => {
  try {
    const productos = await obtenerProductosBajoStock();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/inventario/movimientos - Obtener movimientos de inventario
router.get('/movimientos', async (req, res) => {
  try {
    const movimientos = await obtenerMovimientosInventario();
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/inventario/variante/:id_variante - Obtener inventario por variante
router.get('/variante/:id_variante', async (req, res) => {
  try {
    const inventario = await obtenerInventarioPorVariante(req.params.id_variante);
    if (!inventario) {
      return res.status(404).json({ message: 'Registro de inventario no encontrado' });
    }
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/inventario/stock/:codigoBarras - Actualizar stock
router.put('/stock/:codigoBarras', async (req, res) => {
  try {
    const { cantidad } = req.body;
    const resultado = await actualizarStock(req.params.codigoBarras, cantidad);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/inventario/ajustar - Ajuste manual de stock
router.post('/ajustar', async (req, res) => {
  try {
    const { id_variante, cantidad, motivo, id_usuario } = req.body;
    const resultado = await ajustarStock(id_variante, cantidad, motivo, id_usuario);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;