import express from 'express';
import {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario
} from '../services/usuario.service.js';
import { authenticateToken } from '../middleware/auth.middleware.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'modasoft_secret'

const router = express.Router();

// Ruta pública - Login
router.post('/login', async (req, res) => {
  try {
    const { usuario } = req.body;
    const password = req.body.password || req.body.contrasena;
    const resultado = await loginUsuario(usuario, password);
    
    const user = resultado.usuario;
    const payload = { 
      id_usuario: user.id_usuario, 
      usuario: user.usuario, 
      id_rol: user.id_rol 
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' })
    
    res.json({ 
      message: resultado.message, 
      usuario: user, 
      token 
    })
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Ruta de login (debe estar antes de las rutas protegidas)
router.post('/login', async (req, res) => {
  try {
    const { usuario } = req.body;
    const password = req.body.password || req.body.contrasena;
    const resultado = await loginUsuario(usuario, password);
    
    const user = resultado.usuario;
    const payload = { 
      id_usuario: user.id_usuario, 
      usuario: user.usuario, 
      id_rol: user.id_rol 
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    
    res.json({ 
      message: resultado.message, 
      usuario: user, 
      token 
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(401).json({ message: error.message });
  }
});

// Otras rutas...
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.id_rol !== 1) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    const usuarios = await obtenerTodosLosUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.id_usuario && req.user.id_rol !== 1) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    const usuario = await obtenerUsuarioPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.id_usuario && req.user.id_rol !== 1) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    const usuarioActualizado = await actualizarUsuario(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(400).json({ 
      message: error.message || 'Error al actualizar el usuario' 
    });
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

// Eliminar usuario (solo admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.id_rol !== 1) {
      return res.status(403).json({ message: 'Solo administradores pueden eliminar usuarios' });
    }
    
    const resultado = await eliminarUsuario(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Exportar el router
export default router;