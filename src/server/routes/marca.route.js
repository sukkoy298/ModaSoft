// src/server/routes/marca.route.js

import { Router } from 'express';
import { obtenerTodasLasMarcas } from '../../marca.service.js'; 

const router = Router();

// ** GET /api/marcas **
router.get('/', async (req, res) => {
    try {
        const marcas = await obtenerTodasLasMarcas();
        res.status(200).json(marcas);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener marcas", 
            error: error.message 
        });
    }
});

export default router;