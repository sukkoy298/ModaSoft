import express from 'express';
import {
    obtenerCatalogoCuentas,
    obtenerCuentaPorCodigo,
    crearCuenta,
    actualizarCuenta,
    desactivarCuenta
} from '../services/catalogoCuenta.service.js';

const router = express.Router();

// GET /api/catalogo-cuentas - Obtener todas las cuentas activas
router.get('/', async (req, res) => {
    try {
        const cuentas = await obtenerCatalogoCuentas();
        res.json({
            success: true,
            data: cuentas,
            total: cuentas.length
        });
    } catch (error) {
        console.error('Error en GET /catalogo-cuentas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el catálogo de cuentas',
            error: error.message
        });
    }
});

// GET /api/catalogo-cuentas/:codigo - Obtener cuenta por código
router.get('/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const cuenta = await obtenerCuentaPorCodigo(codigo);
        
        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: cuenta
        });
    } catch (error) {
        console.error('Error en GET /catalogo-cuentas/:codigo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la cuenta',
            error: error.message
        });
    }
});

// POST /api/catalogo-cuentas - Crear nueva cuenta
router.post('/', async (req, res) => {
    try {
        const cuenta = await crearCuenta(req.body);
        res.status(201).json({
            success: true,
            message: 'Cuenta creada exitosamente',
            data: cuenta
        });
    } catch (error) {
        console.error('Error en POST /catalogo-cuentas:', error);
        res.status(400).json({
            success: false,
            message: 'Error al crear la cuenta',
            error: error.message
        });
    }
});

// PUT /api/catalogo-cuentas/:id - Actualizar cuenta
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cuenta = await actualizarCuenta(id, req.body);
        
        res.json({
            success: true,
            message: 'Cuenta actualizada exitosamente',
            data: cuenta
        });
    } catch (error) {
        console.error('Error en PUT /catalogo-cuentas/:id:', error);
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la cuenta',
            error: error.message
        });
    }
});

// DELETE /api/catalogo-cuentas/:id - Desactivar cuenta
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cuenta = await desactivarCuenta(id);
        
        res.json({
            success: true,
            message: 'Cuenta desactivada exitosamente',
            data: cuenta
        });
    } catch (error) {
        console.error('Error en DELETE /catalogo-cuentas/:id:', error);
        res.status(400).json({
            success: false,
            message: 'Error al desactivar la cuenta',
            error: error.message
        });
    }
});

export default router;