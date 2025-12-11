import { sequelize } from './db.js';
import MovimientoContableModel from './src/models/MovimientoContableModel.js';
import VentaModel from './src/models/VentaModel.js';
import { registrarVenta } from './src/server/services/venta.service.js';

async function verifyAccountingDate() {
    try {
        console.log("--- Starting Verification ---");
        const payload = {
            cedula_cliente: '23948576',
            detalles: [{
                id_variante: 1, // Ensure this exists in your distinct DB or use valid ID
                cantidad: 1,
                precio_unitario_venta: 100
            }]
        };

        // Note: registrarVenta might fail if variant 1 doesn't exist or no stock. 
        // We really just want to inspect the LAST created movement if the user just created one.

        const lastMov = await MovimientoContableModel.findOne({
            order: [['created_at', 'DESC']],
            raw: true
        });

        if (lastMov) {
            console.log("Last Movimiento ID:", lastMov.id_movimiento);
            console.log("Fecha Movimiento (Raw):", lastMov.fecha_movimiento);
            console.log("Created At:", lastMov.created_at);

            // Check type of fecha_movimiento
            console.log("Type of Fecha:", typeof lastMov.fecha_movimiento);
            if (lastMov.fecha_movimiento instanceof Date) {
                console.log("ISO String:", lastMov.fecha_movimiento.toISOString());
            }
        } else {
            console.log("No movements found.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

verifyAccountingDate();
