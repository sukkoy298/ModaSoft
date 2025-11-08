import MarcaModel from './models/MarcaModel.js'; 

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
        // Crea la marca usando el campo del modelo (nombre)
        const nuevaMarca = await MarcaModel.create(data); 
        return nuevaMarca;
    } catch (error) {
        console.error("Error al registrar marca:", error);
        // Manejo de error de unicidad
        if (error.name === 'SequelizeUniqueConstraintError') {
             throw new Error(`La marca con el nombre '${data.nombre}' ya existe.`);
        }
        throw error;
    }
};