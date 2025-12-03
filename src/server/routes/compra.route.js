import express from 'express';
import {
  obtenerTodasLasCompras,
  obtenerCompraPorId,
  registrarCompra,
  obtenerComprasPorProveedor
} from '../services/compra.service.js';

const router = express.Router();

// GET /api/compras - Obtener todas las compras
router.get('/', async (req, res) => {
    try {
        const fechaInicio = req.query.fechainicio || req.query.fechaInicio;
        const fechaFin = req.query.fechafin || req.query.fechaFin;
        
        console.log('Filtros recibidos en /compras:', {
            fechaInicio,
            fechaFin,
            todosParams: req.query
        });
        
        const compras = await obtenerTodasLasCompras(fechaInicio, fechaFin);
        res.json(compras);
    } catch (error) {
        console.error('Error en GET /compras:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/compras/:id - Obtener compra por ID
router.get('/', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    const compras = await obtenerTodasLasCompras(fechaInicio, fechaFin);
    res.json(compras);
  } catch (error) {
    console.error('Error en GET /compras:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/compras - Registrar nueva compra
router.post('/', async (req, res) => {
  try {
    const nuevaCompra = await registrarCompra(req.body);
    res.status(201).json(nuevaCompra);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/compras/proveedor/:doc_identidad - Obtener compras por proveedor
router.get('/proveedor/:doc_identidad', async (req, res) => {
  try {
    const compras = await obtenerComprasPorProveedor(req.params.doc_identidad);
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;