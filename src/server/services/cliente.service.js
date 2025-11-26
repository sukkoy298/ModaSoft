import ClienteModel from '../../models/ClienteModel.js';
import VentaModel from '../../models/VentaModel.js';

export const obtenerTodosLosClientes = async () => {
    try {
        const clientes = await ClienteModel.findAll({
            where: { activo: true },
            attributes: [
                'id_cliente',
                'cedula', 
                'nombre', 
                'telefono', 
                'email', 
                'direccion', 
                'tipo', 
                'fecha_registro',
                'activo'
            ],
            order: [['nombre', 'ASC']]
        });
        return clientes;
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        throw new Error("No se pudo obtener la lista de clientes.");
    }
};

export const obtenerClientePorCedula = async (cedula) => {
    try {
        const cliente = await ClienteModel.findOne({
            where: { 
                cedula: cedula,
                activo: true 
            }
        });
        
        if (!cliente) {
            throw new Error('Cliente no encontrado o está inactivo');
        }
        
        return cliente;
    } catch (error) {
        console.error("Error al obtener cliente por cédula:", error);
        throw error;
    }
};

export const obtenerClientesInactivos = async () => {
    try {
        const clientes = await ClienteModel.unscoped().findAll({
            where: { activo: false },
            attributes: [
                'id_cliente',
                'cedula', 
                'nombre', 
                'telefono', 
                'email', 
                'direccion', 
                'tipo', 
                'fecha_registro',
                'activo'
            ],
            order: [['nombre', 'ASC']]
        });
        return clientes;
    } catch (error) {
        console.error("Error al obtener clientes inactivos:", error);
        throw new Error("No se pudo obtener la lista de clientes inactivos.");
    }
};

export const registrarCliente = async (data) => {
    try {
        if (!data.cedula || !data.nombre || !data.telefono || !data.email || !data.direccion || !data.tipo) {
            throw new Error("Todos los campos son obligatorios: cédula, nombre, teléfono, email, dirección, tipo");
        }

        const clienteExistente = await ClienteModel.findOne({
            where: { 
                cedula: data.cedula,
                activo: true 
            }
        });

        if (clienteExistente) {
            throw new Error(`Ya existe un cliente activo con la cédula ${data.cedula}`);
        }

        const clienteInactivo = await ClienteModel.unscoped().findOne({
            where: { 
                cedula: data.cedula,
                activo: false 
            }
        });

        if (clienteInactivo) {
            await ClienteModel.update(
                { 
                    activo: true,
                    nombre: data.nombre,
                    telefono: data.telefono,
                    email: data.email,
                    direccion: data.direccion,
                    tipo: data.tipo,
                    updated_at: new Date()
                },
                { where: { cedula: data.cedula } }
            );
            
            const clienteReactivado = await ClienteModel.findOne({
                where: { cedula: data.cedula }
            });
            
            return {
                message: 'Cliente reactivado y actualizado exitosamente',
                cliente: clienteReactivado,
                accion: 'reactivado'
            };
        }

        const nuevoCliente = await ClienteModel.create({
            ...data,
            activo: true
        });

        return {
            message: 'Cliente registrado exitosamente',
            cliente: nuevoCliente,
            accion: 'creado'
        };

    } catch (error) {
        console.error("Error al registrar cliente:", error);
        throw error;
    }
};

export const actualizarCliente = async (cedula, datos) => {
    try {
        const clienteExistente = await ClienteModel.findOne({
            where: { 
                cedula: cedula,
                activo: true 
            }
        });

        if (!clienteExistente) {
            throw new Error(`Cliente con cédula ${cedula} no encontrado o está inactivo`);
        }

        const [filasActualizadas] = await ClienteModel.update(datos, {
            where: { cedula: cedula }
        });

        if (filasActualizadas === 0) {
            throw new Error("No se realizaron cambios en los datos del cliente");
        }

        const clienteActualizado = await ClienteModel.findOne({
            where: { cedula: cedula }
        });
        
        return clienteActualizado;

    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        throw error;
    }
};

export const eliminarCliente = async (cedula) => {
    try {
        const ventasAsociadas = await VentaModel.count({
            where: { cedula_cliente: cedula }
        });

        if (ventasAsociadas > 0) {
            const [filasActualizadas] = await ClienteModel.update(
                { activo: false },
                { where: { cedula: cedula } }
            );

            if (filasActualizadas === 0) {
                throw new Error(`Cliente con cédula ${cedula} no encontrado`);
            }

            return { 
                message: `Cliente marcado como inactivo (tiene ${ventasAsociadas} venta(s) asociada(s))`,
                tipo: "soft_delete",
                ventas_asociadas: ventasAsociadas
            };
        } else {
            const resultado = await ClienteModel.destroy({
                where: { cedula: cedula }
            });

            if (resultado === 0) {
                throw new Error(`Cliente con cédula ${cedula} no encontrado`);
            }

            return { 
                message: `Cliente eliminado físicamente de la base de datos`,
                tipo: "hard_delete",
                ventas_asociadas: 0
            };
        }

    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        throw error;
    }
};

export const restaurarCliente = async (cedula) => {
    try {
        const clienteExistente = await ClienteModel.unscoped().findOne({
            where: { cedula: cedula }
        });

        if (!clienteExistente) {
            throw new Error(`Cliente con cédula ${cedula} no existe en la base de datos`);
        }

        // Si ya está activo, retornar mensaje
        if (clienteExistente.activo) {
            return { 
                message: `El cliente ${clienteExistente.nombre} ya está activo`,
                tipo: "already_active"
            };
        }

        // Actualizar
        const [filasActualizadas] = await ClienteModel.unscoped().update(
            { activo: true },
            { where: { cedula: cedula } }
        );

        if (filasActualizadas === 0) {
            throw new Error(`Error técnico: No se pudo actualizar el cliente`);
        }

        return { 
            message: `Cliente ${clienteExistente.nombre} restaurado correctamente`,
            tipo: "restore"
        };

    } catch (error) {
        console.error("Error al restaurar cliente:", error);
        throw error;
    }
};

export const verificarEliminacionFisica = async (cedula) => {
    try {
        const ventasAsociadas = await VentaModel.count({
            where: { cedula_cliente: cedula }
        });

        return {
            puede_eliminar_fisicamente: ventasAsociadas === 0,
            ventas_asociadas: ventasAsociadas,
            mensaje: ventasAsociadas > 0 
                ? `El cliente tiene ${ventasAsociadas} venta(s) asociada(s)` 
                : 'El cliente no tiene ventas asociadas'
        };
    } catch (error) {
        console.error("Error al verificar eliminación:", error);
        throw error;
    }
};