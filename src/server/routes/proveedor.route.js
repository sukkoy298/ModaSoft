import express from 'express';
import {
  obtenerTodosLosProveedores,
  obtenerProveedorPorDoc,
  registrarProveedor,
  actualizarProveedor,
  eliminarProveedor
} from '../services/proveedor.service.js';

const router = express.Router();

// GET /api/proveedores - Obtener todos los proveedores
router.get('/', async (req, res) => {
  try {
    const proveedores = await obtenerTodosLosProveedores();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/proveedores/:doc_identidad - Obtener proveedor por documento
router.get('/:doc_identidad', async (req, res) => {
  try {
    const proveedor = await obtenerProveedorPorDoc(req.params.doc_identidad);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/proveedores - Registrar nuevo proveedor
router.post('/', async (req, res) => {
  try {
    const nuevoProveedor = await registrarProveedor(req.body);
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/proveedores/:doc_identidad - Actualizar proveedor
router.put('/:doc_identidad', async (req, res) => {
  try {
    const proveedorActualizado = await actualizarProveedor(req.params.doc_identidad, req.body);
    res.json(proveedorActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/proveedores/:doc_identidad - Eliminar proveedor
router.delete('/:doc_identidad', async (req, res) => {
  try {
    const resultado = await eliminarProveedor(req.params.doc_identidad);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;