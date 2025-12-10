import UsuariosModel from '../../models/UsuarioModel.js';
import RolUsuarioModel from '../../models/RolUsuarioModel.js';
import bcrypt from 'bcryptjs';

export const obtenerTodosLosUsuarios = async () => {
    try {
        const usuarios = await UsuariosModel.findAll({
            attributes: ['id_usuario', 'usuario', 'id_rol', 'created_at'],
            include: [{
                model: RolUsuarioModel,
                as: 'Rol',
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
                as: 'Rol',
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
        if (!data.usuario || !data.password || !data.id_rol) {
            throw new Error("Usuario, contraseña y rol son obligatorios.");
        }

        const password_hash = await bcrypt.hash(data.password, 10);

        const nuevoUsuario = await UsuariosModel.create({
            usuario: data.usuario,
            password_hash: password_hash,
            id_rol: data.id_rol
        });

        const usuarioSinPassword = { ...nuevoUsuario.toJSON() };
        delete usuarioSinPassword.password_hash;

        return { 
            message: 'Registro exitoso', 
            usuario: usuarioSinPassword
        };
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`El usuario '${data.usuario}' ya existe.`);
        }
        throw new Error("Error al registrar el usuario.");
    }
};

export const actualizarUsuario = async (id_usuario, datos) => {
    try {
        // Verificar PRIMERO si el usuario existe
        const usuarioExistente = await UsuariosModel.findByPk(id_usuario);
        if (!usuarioExistente) {
            throw new Error(`Usuario no encontrado.`);
        }

        // Si viene password, hashearlo antes de actualizar
        if (datos.password) {
            datos.password_hash = await bcrypt.hash(datos.password, 10);
            delete datos.password;
        }

        const [filasActualizadas] = await UsuariosModel.update(datos, {
            where: { id_usuario },
        });

        // Si no hubo cambios, retornar mensaje informativo
        if (filasActualizadas === 0) {
            return { message: "No se realizaron cambios en los datos del usuario." };
        }

        const usuarioActualizado = await UsuariosModel.findByPk(id_usuario, {
            attributes: ['id_usuario', 'usuario', 'id_rol', 'created_at']
        });
        
        return {
            message: "Actualizacion exitosa",
            usuario: usuarioActualizado
        };

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
        throw new Error("Error al eliminar el usuario.");
    }
};

export const loginUsuario = async (usuario, password) => {
    try {
        if (!usuario || !password) {
            throw new Error('Usuario y contraseña son obligatorios');
        }

        const usuarioEncontrado = await UsuariosModel.findOne({
            where: { usuario },
            include: [{
                model: RolUsuarioModel,
                as: 'Rol',
                attributes: ['rol']
            }]
        });

        if (!usuarioEncontrado) {
            throw new Error('Credenciales incorrectas');
        }

        const passwordValido = await bcrypt.compare(password, usuarioEncontrado.password_hash);
        
        if (!passwordValido) {
            throw new Error('Credenciales incorrectas');
        }

        const usuarioSinPassword = { ...usuarioEncontrado.toJSON() };
        delete usuarioSinPassword.password_hash;

        return { 
            message: 'Login exitoso', 
            usuario: usuarioSinPassword
        };

    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};