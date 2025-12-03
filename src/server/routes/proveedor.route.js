import express from 'express';
import {
  obtenerTodosLosProveedores,
  obtenerProveedorPorDoc,
  registrarProveedor,
  actualizarProveedor,
  eliminarProveedor,
  obtenerComprasPorProveedor,
  obtenerComprasPorRangoFechas
} from '../services/proveedor.service.js';
import ProveedorModel from '../../models/ProveedorModel.js';

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

// GET /api/proveedores/:doc_identidad/compras - Obtener compras por proveedor
router.get('/:doc_identidad/compras', async (req, res) => {
    try {
        const { doc_identidad } = req.params;
        
        // EXTRAER de CUALQUIER manera posible
        let fechaInicio = req.query.fechainicio || 
                         req.query.fechai || 
                         req.query['fecha-inicio'] ||
                         req.query.fechaInicio;
        
        let fechaFin = req.query.fechafin || 
                      req.query.fechaFin || 
                      req.query['fecha-fin'] ||
                      req.query.fecha_fin;
        
        // Si no hay, usar valores por defecto amplios
        if (!fechaInicio || !fechaFin) {
            fechaInicio = '2000-01-01';
            fechaFin = '2100-12-31';
            console.log('Usando fechas por defecto');
        }
        
        console.log('Fechas a usar:', { fechaInicio, fechaFin });
        
        const compras = await obtenerComprasPorProveedor(
            doc_identidad, 
            fechaInicio,
            fechaFin
        );
        
        // Obtener nombre del proveedor
        const proveedor = await ProveedorModel.findByPk(doc_identidad);
        
        // Formatear respuesta
        const comprasFormateadas = compras.map(compra => ({
            ID: `#${compra.id}`,
            Fecha: compra.fecha_corregida,
            Proveedor: proveedor?.nombre || '',
            Factura: compra.numero_factura || '0.00',
            Subtotal: `USD ${compra.subtotal.toFixed(2).replace('.', ',')}`,
            IVA: `USD ${compra.iva.toFixed(2).replace('.', ',')}`,
            Total: `USD ${compra.total.toFixed(2).replace('.', ',')}`
        }));
        
        res.json({
            success: true,
            count: compras.length,
            filtro: { fechaInicio, fechaFin },
            data: comprasFormateadas
        });
        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/proveedores/compras/rango - Obtener compras por rango de fechas (para todos los proveedores)
router.get('/compras/rango', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const compras = await obtenerComprasPorRangoFechas(fecha_inicio, fecha_fin);
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;