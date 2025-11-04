// server/routes/producto.route.js

import { Router } from 'express';
// Importamos el servicio que acabamos de crear
import { obtenerTodoElInventario } from '../../producto.service.js'; 

const router = Router();

// ** GET /api/productos **
// Endpoint para obtener la lista completa del inventario detallado
router.get('/', async (req, res) => {
    try {
        const inventario = await obtenerTodoElInventario();
        // 200 OK - Devolvemos la lista de inventario
        res.status(200).json(inventario); 
    } catch (error) {
        console.error("Error en la ruta GET /api/productos:", error);
        // 500 Internal Server Error - Devolvemos un mensaje de error genérico
        res.status(500).json({ 
            message: "Error al obtener el inventario", 
            error: error.message 
        });
    }
});

export default router;