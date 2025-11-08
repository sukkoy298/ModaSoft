import RolUsuarioModel from '../../models/RolUsuarioModel.js';

export const obtenerTodosLosRoles = async () => {
    try {
        const roles = await RolUsuarioModel.findAll({
            attributes: ['id_rol', 'rol', 'created_at'],
            order: [['rol', 'ASC']]
        });
        return roles;
    } catch (error) {
        console.error("Error al obtener los roles:", error);
        throw new Error("No se pudo obtener la lista de roles.");
    }
};

export const obtenerRolPorId = async (id_rol) => {
    try {
        const rol = await RolUsuarioModel.findByPk(id_rol, {
            attributes: ['id_rol', 'rol', 'created_at']
        });
        return rol;
    } catch (error) {
        console.error("Error al obtener rol por ID:", error);
        throw new Error("Error al obtener el rol.");
    }
};

export const registrarRol = async (data) => {
    try {
        if (!data.rol) {
            throw new Error("El nombre del rol es obligatorio.");
        }

        const nuevoRol = await RolUsuarioModel.create(data);
        return nuevoRol;
    } catch (error) {
        console.error("Error al registrar rol:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`El rol '${data.rol}' ya existe.`);
        }
        throw error;
    }
};

export const actualizarRol = async (id_rol, datos) => {
    try {
        const [filasActualizadas] = await RolUsuarioModel.update(datos, {
            where: { id_rol },
        });

        if (filasActualizadas === 0) {
            const rol = await RolUsuarioModel.findByPk(id_rol);
            if (!rol) {
                throw new Error(`Rol no encontrado.`);
            }
            return { message: "Datos del rol sin cambios." };
        }

        const rolActualizado = await RolUsuarioModel.findByPk(id_rol);
        return rolActualizado;
    } catch (error) {
        console.error("Error al actualizar rol:", error);
        throw error;
    }
};

export const eliminarRol = async (id_rol) => {
    try {
        const resultado = await RolUsuarioModel.destroy({
            where: { id_rol }
        });

        if (resultado === 0) {
            throw new Error(`Rol con ID ${id_rol} no encontrado.`);
        }
        return { message: `Rol eliminado con éxito.` };
    } catch (error) {
        console.error("Error al eliminar rol:", error);
        throw error;
    }
};