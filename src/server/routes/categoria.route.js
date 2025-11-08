import { Router } from 'express';
import { obtenerTodasLasCategorias, registrarCategoria } from '../../categoria.service.js';

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

router.post('/', async (req, res) => {
    try {
        const nuevaCategoria = await registrarCategoria(req.body);
        res.status(201).json({ 
            message: "Categoría registrada con éxito.", 
            categoria: nuevaCategoria 
        }); 
    } catch (error) {
        // Usa 400 para errores de validación o negocio (ej: nombre ya existe)
        res.status(400).json({ 
            message: "Error al registrar categoría.", 
            error: error.message 
        });
    }
});

export default router;