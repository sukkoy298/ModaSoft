import CategoriaModel from './models/CategoriaModel.js';

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