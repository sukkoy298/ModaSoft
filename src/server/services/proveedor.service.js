import ProveedorModel from '../../models/ProveedorModel.js';

export const obtenerTodosLosProveedores = async () => {
    try {
        const proveedores = await ProveedorModel.findAll({
            attributes: ['doc_identidad', 'nombre', 'telefono', 'email', 'direccion'],
            order: [['nombre', 'ASC']]
        });
        return proveedores;
    } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        throw new Error("No se pudo obtener la lista de proveedores.");
    }
};

export const obtenerProveedorPorDoc = async (doc_identidad) => {
    try {
        const proveedor = await ProveedorModel.findByPk(doc_identidad);
        return proveedor;
    } catch (error) {
        console.error("Error al obtener proveedor por documento:", error);
        throw new Error("Error en la base de datos.");
    }
};

export const registrarProveedor = async (data) => {
    try {
        if (!data.doc_identidad || !data.nombre) {
            throw new Error("Documento de identidad y nombre son obligatorios.");
        }

        const nuevoProveedor = await ProveedorModel.create(data);
        return nuevoProveedor;
    } catch (error) {
        console.error("Error al registrar proveedor:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`El proveedor con documento '${data.doc_identidad}' ya existe.`);
        }
        throw error;
    }
};

export const actualizarProveedor = async (doc_identidad, datos) => {
    try {
        const [filasActualizadas] = await ProveedorModel.update(datos, {
            where: { doc_identidad },
        });

        if (filasActualizadas === 0) {
            const proveedor = await ProveedorModel.findByPk(doc_identidad);
            if (!proveedor) {
                throw new Error(`Proveedor no encontrado.`);
            }
            return { message: "Datos del proveedor sin cambios." };
        }

        const proveedorActualizado = await ProveedorModel.findByPk(doc_identidad);
        return proveedorActualizado;
    } catch (error) {
        console.error("Error al actualizar proveedor:", error);
        throw error;
    }
};

export const eliminarProveedor = async (doc_identidad) => {
    try {
        const resultado = await ProveedorModel.destroy({
            where: { doc_identidad }
        });

        if (resultado === 0) {
            throw new Error(`Proveedor con documento ${doc_identidad} no encontrado.`);
        }
        return { message: `Proveedor eliminado con éxito.` };
    } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        throw error;
    }
};