// src/server/categoria.service.js

import CategoriaModel from './models/CategoriaModel.js'; // Ajusta la ruta si es necesario

/**
 * Obtiene todas las categorías de la base de datos.
 * @returns {Promise<Array>} Lista de categorías.
 */
export const obtenerTodasLasCategorias = async () => {
    try {
        const categorias = await CategoriaModel.findAll({
            attributes: ['id_categoria', 'nombre'], 
            order: [['nombre', 'ASC']]
        });
        return categorias;
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        throw new Error("No se pudo obtener la lista de categorías.");
    }
};