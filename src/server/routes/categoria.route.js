import express from 'express';
import {
  obtenerTodasLasCategorias,
  registrarCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoriaPorId
} from '../services/categoria.service.js';

const router = express.Router();

// GET /api/categorias - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await obtenerTodasLasCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categorias/:id - Obtener categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const categoria = await obtenerCategoriaPorId(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categorias - Registrar nueva categoría
router.post('/', async (req, res) => {
  try {
    const nuevaCategoria = await registrarCategoria(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/categorias/:id - Actualizar categoría
router.put('/:id', async (req, res) => {
  try {
    const categoriaActualizada = await actualizarCategoria(req.params.id, req.body);
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/categorias/:id - Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await eliminarCategoria(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;