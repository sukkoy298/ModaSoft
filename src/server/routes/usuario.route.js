import express from 'express';
import {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario
} from '../services/usuario.service.js';

const router = express.Router();

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await obtenerTodosLosUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/usuarios - Registrar nuevo usuario
router.post('/', async (req, res) => {
  try {
    const nuevoUsuario = await registrarUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/usuarios/login - Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const resultado = await loginUsuario(usuario, password);
    res.json(resultado);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const usuarioActualizado = await actualizarUsuario(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await eliminarUsuario(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;