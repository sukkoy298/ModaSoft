import CategoriaModel from '../../models/CategoriaModel.js';

export const obtenerTodasLasCategorias = async () => {
    try {
        const categorias = await CategoriaModel.findAll({
            attributes: ['id_categoria', 'nombre', 'descripcion'],
            order: [['nombre', 'ASC']]
        });
        return categorias;
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        throw new Error("No se pudo obtener la lista de categorías.");
    }
};

export const obtenerCategoriaPorId = async (id_categoria) => {
    try {
        const categoria = await CategoriaModel.findByPk(id_categoria, {
            attributes: ['id_categoria', 'nombre', 'descripcion']
        });
        return categoria;
    } catch (error) {
        console.error("Error al obtener categoría por ID:", error);
        throw new Error("Error al obtener la categoría.");
    }
};

export const registrarCategoria = async (data) => {
    try {
        if (!data.nombre) {
            throw new Error("El nombre de la categoría es obligatorio.");
        }

        const nuevaCategoria = await CategoriaModel.create(data);
        return nuevaCategoria;
    } catch (error) {
        console.error("Error al registrar categoría:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`La categoría '${data.nombre}' ya existe.`);
        }
        throw error;
    }
};

export const actualizarCategoria = async (id_categoria, datos) => {
    try {
        const [filasActualizadas] = await CategoriaModel.update(datos, {
            where: { id_categoria },
        });

        if (filasActualizadas === 0) {
            const categoria = await CategoriaModel.findByPk(id_categoria);
            if (!categoria) {
                throw new Error(`Categoría no encontrada.`);
            }
            return { message: "Datos de la categoría sin cambios." };
        }

        const categoriaActualizada = await CategoriaModel.findByPk(id_categoria);
        return categoriaActualizada;
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        throw error;
    }
};

export const eliminarCategoria = async (id_categoria) => {
    try {
        const resultado = await CategoriaModel.destroy({
            where: { id_categoria }
        });

        if (resultado === 0) {
            throw new Error(`Categoría con ID ${id_categoria} no encontrada.`);
        }
        return { message: `Categoría eliminada con éxito.` };
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        throw error;
    }
};