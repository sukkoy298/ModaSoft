import UsuariosModel from '../../models/UsuarioModel.js';
import RolUsuarioModel from '../../models/RolUsuarioModel.js';

export const obtenerTodosLosUsuarios = async () => {
    try {
        const usuarios = await UsuariosModel.findAll({
            attributes: ['id_usuario', 'usuario', 'id_rol', 'created_at'],
            include: [{
                model: RolUsuarioModel,
                as: 'RolUsuario',
                attributes: ['rol']
            }],
            order: [['usuario', 'ASC']]
        });
        return usuarios;
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        throw new Error("No se pudo obtener la lista de usuarios.");
    }
};

export const obtenerUsuarioPorId = async (id_usuario) => {
    try {
        const usuario = await UsuariosModel.findByPk(id_usuario, {
            include: [{
                model: RolUsuarioModel,
                as: 'RolUsuario',
                attributes: ['rol']
            }]
        });
        return usuario;
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        throw new Error("Error al obtener el usuario.");
    }
};

export const registrarUsuario = async (data) => {
    try {
        if (!data.usuario || !data.password_hash || !data.id_rol) {
            throw new Error("Usuario, contraseña y rol son obligatorios.");
        }

        const nuevoUsuario = await UsuariosModel.create(data);
        return nuevoUsuario;
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`El usuario '${data.usuario}' ya existe.`);
        }
        throw error;
    }
};

export const actualizarUsuario = async (id_usuario, datos) => {
    try {
        const [filasActualizadas] = await UsuariosModel.update(datos, {
            where: { id_usuario },
        });

        if (filasActualizadas === 0) {
            const usuario = await UsuariosModel.findByPk(id_usuario);
            if (!usuario) {
                throw new Error(`Usuario no encontrado.`);
            }
            return { message: "Datos del usuario sin cambios." };
        }

        const usuarioActualizado = await UsuariosModel.findByPk(id_usuario);
        return usuarioActualizado;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
    }
};

export const eliminarUsuario = async (id_usuario) => {
    try {
        const resultado = await UsuariosModel.destroy({
            where: { id_usuario }
        });

        if (resultado === 0) {
            throw new Error(`Usuario con ID ${id_usuario} no encontrado.`);
        }
        return { message: `Usuario eliminado con éxito.` };
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
};

export const loginUsuario = async (usuario, password) => {
    try {
        // Implementación básica de login - ajusta según tu lógica
        const usuarioEncontrado = await UsuariosModel.findOne({
            where: { usuario, password_hash: password }, // En realidad deberías usar bcrypt
            include: [{
                model: RolUsuarioModel,
                as: 'RolUsuario',
                attributes: ['rol']
            }]
        });

        if (!usuarioEncontrado) {
            throw new Error('Credenciales incorrectas');
        }

        return { 
            message: 'Login exitoso', 
            usuario: usuarioEncontrado 
        };
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};