import express from 'express';
import {
  obtenerTodasLasMarcas,
  registrarMarca,
  actualizarMarca,
  eliminarMarca,
  obtenerMarcaPorId
} from '../services/marca.service.js';

const router = express.Router();

// GET /api/marcas - Obtener todas las marcas
router.get('/', async (req, res) => {
  try {
    const marcas = await obtenerTodasLasMarcas();
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/marcas/:id - Obtener marca por ID
router.get('/:id', async (req, res) => {
  try {
    const marca = await obtenerMarcaPorId(req.params.id);
    if (!marca) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    res.json(marca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/marcas - Registrar nueva marca
router.post('/', async (req, res) => {
  try {
    const nuevaMarca = await registrarMarca(req.body);
    res.status(201).json(nuevaMarca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/marcas/:id - Actualizar marca
router.put('/:id', async (req, res) => {
  try {
    const marcaActualizada = await actualizarMarca(req.params.id, req.body);
    res.json(marcaActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/marcas/:id - Eliminar marca
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await eliminarMarca(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;