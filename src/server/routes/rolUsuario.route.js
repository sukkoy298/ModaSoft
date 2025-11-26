import express from 'express';
import {
  obtenerTodosLosRoles,
  obtenerRolPorId,
  registrarRol,
  actualizarRol,
  eliminarRol
} from '../services/rolUsuario.service.js';

const router = express.Router();

// GET /api/roles - Obtener todos los roles
router.get('/', async (req, res) => {
  try {
    const roles = await obtenerTodosLosRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/roles/:id - Obtener rol por ID
router.get('/:id', async (req, res) => {
  try {
    const rol = await obtenerRolPorId(req.params.id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/roles - Registrar nuevo rol
router.post('/', async (req, res) => {
  try {
    const nuevoRol = await registrarRol(req.body);
    res.status(201).json(nuevoRol);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/roles/:id - Actualizar rol
router.put('/:id', async (req, res) => {
  try {
    const rolActualizado = await actualizarRol(req.params.id, req.body);
    res.json(rolActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/roles/:id - Eliminar rol
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await eliminarRol(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;