import ClienteModel from '../../models/ClienteModel.js';

export const obtenerTodosLosClientes = async () => {
    try {
        const clientes = await ClienteModel.findAll({
            attributes: ['id_cliente', 'cedula', 'nombre', 'email', 'telefono', 'direccion', 'tipo', 'fecha_registro'],
            order: [['nombre', 'ASC']]
        });
        return clientes;
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        throw new Error("No se pudo obtener la lista de clientes.");
    }
};

export const obtenerClientePorCedula = async (cedula) => {
    try {
        const cliente = await ClienteModel.findOne({
            where: { cedula }
        });
        return cliente;
    } catch (error) {
        console.error("Error al obtener cliente por cédula:", error);
        throw new Error("Error en la base de datos.");
    }
};

export const registrarCliente = async (data) => {
    try {
        if (!data.cedula || !data.nombre || !data.tipo) {
            throw new Error("Cédula, nombre y tipo son obligatorios.");
        }

        const nuevoCliente = await ClienteModel.create({
            ...data,
            fecha_registro: new Date()
        });
        
        return nuevoCliente;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`La cédula ${data.cedula} ya está registrada.`);
        }
        console.error("Error al registrar cliente:", error);
        throw new Error("Error al intentar registrar el cliente.");
    }
};

export const actualizarCliente = async (cedula, datos) => {
    try {
        const [filasActualizadas] = await ClienteModel.update(datos, {
            where: { cedula },
        });

        if (filasActualizadas === 0) {
            const cliente = await ClienteModel.findOne({ where: { cedula } });
            if (!cliente) {
                throw new Error(`Cliente no encontrado.`);
            }
            return { message: "Datos del cliente sin cambios." };
        }

        const clienteActualizado = await ClienteModel.findOne({ where: { cedula } });
        return clienteActualizado;
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        throw error;
    }
};

export const eliminarCliente = async (cedula) => {
    try {
        const resultado = await ClienteModel.destroy({
            where: { cedula }
        });

        if (resultado === 0) {
            throw new Error(`Cliente con cédula ${cedula} no encontrado.`);
        }
        return { message: `Cliente con cédula ${cedula} eliminado con éxito.` };
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        throw error;
    }
};