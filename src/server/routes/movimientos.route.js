import express from 'express';
import {
    obtenerMovimientos,
    obtenerMovimientosConFiltros,
    obtenerResumenContable,
    registrarMovimiento
} from '../services/movimiento.service.js';

const router = express.Router();

// GET /api/movimientos - listar movimientos con filtros
router.get('/', async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, codigo_cuenta, tipo } = req.query;
        
        const movimientos = await obtenerMovimientosConFiltros({
            fecha_inicio,
            fecha_fin,
            codigo_cuenta,
            tipo
        });
        
        res.json({
            success: true,
            data: movimientos,
            total: movimientos.length
        });
    } catch (error) {
        console.error('Error en GET /movimientos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener movimientos contables',
            error: error.message
        });
    }
});

// GET /api/movimientos/resumen - obtener resumen contable
router.get('/resumen', async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const resumen = await obtenerResumenContable(fecha_inicio, fecha_fin);
        
        res.json({
            success: true,
            data: resumen
        });
    } catch (error) {
        console.error('Error en GET /movimientos/resumen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener resumen contable',
            error: error.message
        });
    }
});

// POST /api/movimientos - crear movimiento contable manual
router.post('/', async (req, res) => {
    try {
        const movimiento = await registrarMovimiento(req.body);
        res.status(201).json({
            success: true,
            message: 'Movimiento registrado exitosamente',
            data: movimiento
        });
    } catch (error) {
        console.error('Error en POST /movimientos:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error al registrar el movimiento'
        });
    }
});

export default router;