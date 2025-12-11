import { sequelize } from './db.js';
import VentaModel from './src/models/VentaModel.js';

async function testDateCreation() {
    try {
        console.log("Current System Date:", new Date().toString());
        console.log("Current System Date (ISO):", new Date().toISOString());

        const venta = await VentaModel.create({
            cedula_cliente: '23948576', // Using the default client ID seen in facturacion.vue
            fecha: new Date(),
            total: 100.00,
            subtotal: 90.00,
            iva: 10.00,
            estado: 'test',
            id_usuario: 1
        });

        console.log("Created Venta ID:", venta.id_venta);
        console.log("Saved Date (MODEL):", venta.fecha);
        console.log("Saved Date (JSON):", venta.toJSON().fecha);

        // Fetch it back to be sure
        const refetched = await VentaModel.findByPk(venta.id_venta);
        console.log("Refetched Date:", refetched.fecha);

        // Clean up
        await refetched.destroy();
        console.log("Test record deleted.");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

testDateCreation();
