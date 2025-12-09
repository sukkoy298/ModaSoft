import ProveedorModel from '../../models/ProveedorModel.js';

export const obtenerTodosLosProveedores = async () => {
    try {
        const proveedores = await ProveedorModel.findAll({
            order: [['nombre', 'ASC']]
        });
        return proveedores;
    } catch (error) {
        console.error("Error al obtener proveedores:", error);
        throw new Error("No se pudo obtener la lista de proveedores.");
    }
};

export const obtenerProveedorPorDocIdentidad = async (doc_identidad) => {
    try {
        const proveedor = await ProveedorModel.findOne({
            where: { doc_identidad: doc_identidad }
        });
        
        if (!proveedor) {
            throw new Error('Proveedor no encontrado');
        }
        
        return proveedor;
    } catch (error) {
        console.error("Error al obtener proveedor:", error);
        throw error;
    }
};

export const registrarProveedor = async (data) => {
    try {
        // Validaciones básicas
        if (!data.doc_identidad || !data.nombre) {
            throw new Error("Documento de identidad y nombre son obligatorios");
        }

        // Verificar si ya existe
        const proveedorExistente = await ProveedorModel.findOne({
            where: { doc_identidad: data.doc_identidad }
        });

        if (proveedorExistente) {
            throw new Error(`Ya existe un proveedor con el documento ${data.doc_identidad}`);
        }

        // Crear nuevo proveedor
        const nuevoProveedor = await ProveedorModel.create(data);

        return {
            message: 'Proveedor registrado exitosamente',
            proveedor: nuevoProveedor,
            accion: 'creado'
        };

    } catch (error) {
        console.error("Error al registrar proveedor:", error);
        throw error;
    }
};

export const actualizarProveedor = async (doc_identidad, datos) => {
    try {
        const proveedorExistente = await ProveedorModel.findOne({
            where: { doc_identidad: doc_identidad }
        });

        if (!proveedorExistente) {
            throw new Error(`Proveedor con documento ${doc_identidad} no encontrado`);
        }

        const [filasActualizadas] = await ProveedorModel.update(datos, {
            where: { doc_identidad: doc_identidad }
        });

        if (filasActualizadas === 0) {
            throw new Error("No se realizaron cambios en los datos del proveedor");
        }

        const proveedorActualizado = await ProveedorModel.findOne({
            where: { doc_identidad: doc_identidad }
        });
        
        return proveedorActualizado;

    } catch (error) {
        console.error("Error al actualizar proveedor:", error);
        throw error;
    }
};

export const eliminarProveedor = async (doc_identidad) => {
    try {
        const resultado = await ProveedorModel.destroy({
            where: { doc_identidad: doc_identidad }
        });

        if (resultado === 0) {
            throw new Error(`Proveedor con documento ${doc_identidad} no encontrado`);
        }

        return { 
            message: `Proveedor eliminado correctamente`,
            tipo: "eliminado"
        };

    } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        throw error;
    }
};

export const buscarProveedores = async (termino) => {
    try {
        const proveedores = await ProveedorModel.findAll({
            where: {
                [Op.or]: [
                    { doc_identidad: { [Op.like]: `%${termino}%` } },
                    { nombre: { [Op.like]: `%${termino}%` } },
                    { email: { [Op.like]: `%${termino}%` } }
                ]
            },
            order: [['nombre', 'ASC']]
        });
        return proveedores;
    } catch (error) {
        console.error("Error al buscar proveedores:", error);
        throw error;
    }
};