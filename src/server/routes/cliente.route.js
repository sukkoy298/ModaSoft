import express from 'express';
import {
  obtenerTodosLosClientes,
  obtenerClientePorCedula,
  obtenerClientesInactivos,
  registrarCliente,
  actualizarCliente,
  eliminarCliente,
  restaurarCliente,
  verificarEliminacionFisica
} from '../services/cliente.service.js';

const router = express.Router();

import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';

// GET /api/clientes - Obtener todos los clientes ACTIVOS
router.get('/', authenticateToken, async (req, res) => {
  try {
    const clientes = await obtenerTodosLosClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/clientes/inactivos - Obtener clientes INACTIVOS
router.get('/inactivos', authenticateToken, async (req, res) => {
  try {
    const clientes = await obtenerClientesInactivos();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/clientes/:cedula - Obtener cliente por cédula
router.get('/:cedula', authenticateToken, async (req, res) => {
  try {
    const cliente = await obtenerClientePorCedula(req.params.cedula);
    res.json(cliente);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// POST /api/clientes - Registrar nuevo cliente
router.post('/', authenticateToken, authorizeRoles([1,2]), async (req, res) => {
  try {
    const nuevoCliente = await registrarCliente(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/clientes/:cedula - Actualizar cliente
router.put('/:cedula', authenticateToken, authorizeRoles([1,2]), async (req, res) => {
  try {
    const clienteActualizado = await actualizarCliente(req.params.cedula, req.body);
    res.json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/clientes/:cedula - Eliminar cliente
router.delete('/:cedula', authenticateToken, authorizeRoles([1,2]), async (req, res) => {
  try {
    const resultado = await eliminarCliente(req.params.cedula);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/clientes/:cedula/restaurar - Restaurar cliente
router.post('/:cedula/restaurar', authenticateToken, authorizeRoles([1,2]), async (req, res) => {
  try {
    const resultado = await restaurarCliente(req.params.cedula);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/clientes/:cedula/verificar-eliminacion - Verificar eliminación (opcional)
router.get('/:cedula/verificar-eliminacion', authenticateToken, async (req, res) => {
  try {
    const resultado = await verificarEliminacionFisica(req.params.cedula);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;