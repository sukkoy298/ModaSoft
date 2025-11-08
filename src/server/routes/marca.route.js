import { Router } from 'express';
import { obtenerTodasLasMarcas, registrarMarca } from '../../marca.service.js';

const router = Router();

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

router.post('/', async (req, res) => {
    try {
        const nuevaMarca = await registrarMarca(req.body);
        res.status(201).json({ 
            message: "Marca registrada con éxito.", 
            marca: nuevaMarca 
        });
    } catch (error) {
        res.status(400).json({ 
            message: "Error al registrar marca.", 
            error: error.message 
        });
    }
});

export default router;