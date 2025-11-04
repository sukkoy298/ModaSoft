import { Router } from 'express';
import { obtenerTodasLasCategorias } from '../../categoria.service.js'; 

const router = Router();

router.get('/', async (req, res) => {
    try {
        const categorias = await obtenerTodasLasCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener categorías", 
            error: error.message 
        });
    }
});

export default router;