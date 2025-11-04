import { Router } from 'express';
import { obtenerTodoElInventario } from '../../producto.service.js'; 

const router = Router();

router.get('/', async (req, res) => {
    try {
        const inventario = await obtenerTodoElInventario();
        res.status(200).json(inventario); 
    } catch (error) {
        console.error("Error en la ruta GET /api/productos:", error);
        res.status(500).json({ 
            message: "Error al obtener el inventario", 
            error: error.message 
        });
    }
});

export default router;