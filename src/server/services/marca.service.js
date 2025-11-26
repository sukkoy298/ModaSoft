import MarcaModel from '../../models/MarcaModel.js';

export const obtenerTodasLasMarcas = async () => {
    try {
        const marcas = await MarcaModel.findAll({
            attributes: ['id_marca', 'nombre'],
            order: [['nombre', 'ASC']]
        });
        return marcas;
    } catch (error) {
        console.error("Error al obtener las marcas:", error);
        throw new Error("No se pudo obtener la lista de marcas.");
    }
};

export const registrarMarca = async (data) => {
    try {
        if (!data.nombre) {
            throw new Error("El nombre de la marca es obligatorio.");
        }

        const nuevaMarca = await MarcaModel.create(data);
        return nuevaMarca;
    } catch (error) {
        console.error("Error al registrar marca:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`La marca '${data.nombre}' ya existe.`);
        }
        throw error;
    }
};

export const actualizarMarca = async (id_marca, datos) => {
    try {
        const [filasActualizadas] = await MarcaModel.update(datos, {
            where: { id_marca },
        });

        if (filasActualizadas === 0) {
            const marca = await MarcaModel.findByPk(id_marca);
            if (!marca) {
                throw new Error(`Marca no encontrada.`);
            }
            return { message: "Datos de la marca sin cambios." };
        }

        const marcaActualizada = await MarcaModel.findByPk(id_marca);
        return marcaActualizada;
    } catch (error) {
        console.error("Error al actualizar marca:", error);
        throw error;
    }
};

export const obtenerMarcaPorId = async (id_marca) => {
    try {
        const marca = await MarcaModel.findByPk(id_marca, {
            attributes: ['id_marca', 'nombre']
        });
        return marca;
    } catch (error) {
        console.error("Error al obtener marca por ID:", error);
        throw new Error("Error al obtener la marca.");
    }
};

export const eliminarMarca = async (id_marca) => {
    try {
        const resultado = await MarcaModel.destroy({
            where: { id_marca }
        });

        if (resultado === 0) {
            throw new Error(`Marca con ID ${id_marca} no encontrada.`);
        }
        return { message: `Marca eliminada con éxito.` };
    } catch (error) {
        console.error("Error al eliminar marca:", error);
        throw error;
    }
};