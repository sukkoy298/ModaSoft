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