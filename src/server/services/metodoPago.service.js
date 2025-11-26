import MetodoPagoModel from '../../models/MetodoPagoModel.js';

export const obtenerTodosLosMetodosPago = async () => {
    try {
        const metodosPago = await MetodoPagoModel.findAll({
            attributes: ['id_metodopago', 'nombre', 'codigo', 'created_at'],
            order: [['nombre', 'ASC']]
        });
        return metodosPago;
    } catch (error) {
        console.error("Error al obtener los métodos de pago:", error);
        throw new Error("No se pudo obtener la lista de métodos de pago.");
    }
};

export const obtenerMetodoPagoPorId = async (id_metodopago) => {
    try {
        const metodoPago = await MetodoPagoModel.findByPk(id_metodopago, {
            attributes: ['id_metodopago', 'nombre', 'codigo', 'created_at']
        });
        return metodoPago;
    } catch (error) {
        console.error("Error al obtener método de pago por ID:", error);
        throw new Error("Error al obtener el método de pago.");
    }
};

export const registrarMetodoPago = async (data) => {
    try {
        if (!data.nombre) {
            throw new Error("El nombre del método de pago es obligatorio.");
        }

        const nuevoMetodoPago = await MetodoPagoModel.create(data);
        return nuevoMetodoPago;
    } catch (error) {
        console.error("Error al registrar método de pago:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`El método de pago '${data.nombre}' ya existe.`);
        }
        throw error;
    }
};

export const actualizarMetodoPago = async (id_metodopago, datos) => {
    try {
        const [filasActualizadas] = await MetodoPagoModel.update(datos, {
            where: { id_metodopago },
        });

        if (filasActualizadas === 0) {
            const metodoPago = await MetodoPagoModel.findByPk(id_metodopago);
            if (!metodoPago) {
                throw new Error(`Método de pago no encontrado.`);
            }
            return { message: "Datos del método de pago sin cambios." };
        }

        const metodoPagoActualizado = await MetodoPagoModel.findByPk(id_metodopago);
        return metodoPagoActualizado;
    } catch (error) {
        console.error("Error al actualizar método de pago:", error);
        throw error;
    }
};

export const eliminarMetodoPago = async (id_metodopago) => {
    try {
        const resultado = await MetodoPagoModel.destroy({
            where: { id_metodopago }
        });

        if (resultado === 0) {
            throw new Error(`Método de pago con ID ${id_metodopago} no encontrado.`);
        }
        return { message: `Método de pago eliminado con éxito.` };
    } catch (error) {
        console.error("Error al eliminar método de pago:", error);
        throw error;
    }
};