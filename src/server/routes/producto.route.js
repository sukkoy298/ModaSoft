import express from 'express';
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  registrarProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerInventarioCompleto
} from '../services/producto.service.js';

const router = express.Router();

// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await obtenerTodosLosProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/inventario - Obtener inventario completo
router.get('/inventario', async (req, res) => {
  try {
    const inventario = await obtenerInventarioCompleto();
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await obtenerProductoPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/productos - Registrar nuevo producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = await registrarProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const productoActualizado = await actualizarProducto(req.params.id, req.body);
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await eliminarProducto(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;