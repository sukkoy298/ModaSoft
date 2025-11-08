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

export const registrarCategoria = async (data) => {
    try {
        if (!data.nombre) {
            throw new Error("El nombre de la categoría es obligatorio.");
        }
        // Crea la categoría usando los campos del modelo (nombre, descripcion)
        const nuevaCategoria = await CategoriaModel.create(data); 
        return nuevaCategoria;
    } catch (error) {
        console.error("Error al registrar categoría:", error);
        // Manejo de error de unicidad (si el nombre ya existe)
        if (error.name === 'SequelizeUniqueConstraintError') {
             throw new Error(`La categoría con el nombre '${data.nombre}' ya existe.`);
        }
        throw error;
    }
};