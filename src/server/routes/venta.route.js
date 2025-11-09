import { Router } from 'express';
import { registrarVenta } from '../../venta.service.js';
import { Sequelize } from 'sequelize'; // <-- Importa la clase Sequelize

const router = Router();

// Ruta para registrar una nueva venta
router.post('/', async (req, res) => {
  try {
    console.log('[API] POST /api/ventas - inicio');
    const ventaData = req.body;

    // --- Validación básica del payload ---
    if (!ventaData.lines || ventaData.lines.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío o no se enviaron líneas de venta.' });
    }
    if (ventaData.total === undefined || ventaData.total === null) {
      return res.status(400).json({ message: 'El total de la venta es requerido.' });
    }
    if (!ventaData.cliente || !ventaData.cliente.cedula) {
      // Si no hay cliente, se usará el fallback en el servicio, pero es bueno validar aquí también
      console.warn('[API] POST /api/ventas - Venta sin cliente específico. Se usará cliente genérico.');
    }
    // --- Fin Validación básica ---

    const nuevaVenta = await registrarVenta(ventaData);
    console.log(`[API] POST /api/ventas - Venta registrada con ID: ${nuevaVenta.id_venta}`);
    return res.status(201).json({
      message: 'Venta registrada correctamente',
      venta: nuevaVenta
    });
  } catch (err) {
    console.error('[API] POST /api/ventas - ERROR:', err && err.stack ? err.stack : err);
    if (err.original) {
      console.error('[API] POST /api/ventas - DB Original Error:', err.original);
    }

    // Manejo específico de errores de Sequelize
    if (err instanceof Sequelize.ValidationError) { // <-- Accede a ValidationError desde Sequelize
      return res.status(400).json({
        message: 'Error de validación en los datos de la venta.',
        error: err.message,
        details: err.errors ? err.errors.map(e => e.message) : undefined
      });
    } else if (err instanceof Sequelize.ForeignKeyConstraintError) { // <-- Accede a ForeignKeyConstraintError desde Sequelize
      return res.status(400).json({
        message: 'Error de datos: una clave foránea no existe (ej. cliente, usuario, método de pago, variante).',
        error: err.message,
        details: err.original ? err.original.message : undefined
      });
    } else if (err.message.includes('Stock insuficiente')) {
      return res.status(400).json({
        message: 'Error de stock: ' + err.message,
        error: err.message
      });
    }

    return res.status(500).json({
      message: 'Error interno del servidor al registrar la venta',
      error: err.message || 'No se pudo registrar la venta.'
    });
  }
});

export default router;