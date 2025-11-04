// Modelo de Sequelize
import ClienteModel from './models/ClienteModel.js'; 

// 1. OBTENER LISTA
export const obtenerTodosLosClientesDB = async () => {
    try {
        const clientes = await ClienteModel.findAll();
        return clientes;
    } catch (error) {
        console.error("Error DB al obtener todos los clientes:", error);
        throw new Error("Error en la base de datos.");
    }
};

// 2. OBTENER CLIENTE POR CÉDULA
export const obtenerClientePorCedulaDB = async (cedula) => {
    try {
        const cliente = await ClienteModel.findByPk(cedula); 
        return cliente; // Puede ser null si no existe
    } catch (error) {
        console.error("Error DB al obtener cliente por cédula:", error);
        throw new Error("Error en la base de datos.");
    }
};

// 3. REGISTRAR CLIENTE
export const agregarClienteDB = async (data) => {
    try {
        const nuevoCliente = await ClienteModel.create(data);
        return nuevoCliente;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`La cédula ${data.cedula} ya está registrada.`);
        }
        console.error("Error DB al registrar cliente:", error);
        throw new Error("Error al intentar registrar el cliente.");
    }
};

// 4. ACTUALIZAR CLIENTE
export const editarClienteDB = async (cedula, datos) => {
    try {
        const [filasActualizadas] = await ClienteModel.update(datos, {
            where: { cedula },
        });

        if (filasActualizadas === 0) {
            const cliente = await ClienteModel.findByPk(cedula);
            if (!cliente) {
                throw new Error(`Cliente no encontrado.`);
            }
            return { message: "Datos del cliente sin cambios." };
        }

        const clienteActualizado = await ClienteModel.findByPk(cedula);
        return clienteActualizado;
    } catch (error) {
        console.error("Error DB al actualizar cliente:", error);
        throw error; 
    }
};

// 5. ELIMINAR CLIENTE
export const eliminarClienteDB = async (cedula) => {
    try {
        const resultado = await ClienteModel.destroy({
            where: { cedula }
        });

        if (resultado === 0) {
            throw new Error(`Cliente con cédula ${cedula} no encontrado.`);
        }
        return { message: `Cliente con cédula ${cedula} eliminado con éxito.` };
    } catch (error) {
        console.error("Error DB al eliminar cliente:", error);
        throw error;
    }
};