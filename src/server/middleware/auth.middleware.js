import jwt from 'jsonwebtoken';
import UsuariosModel from '../../models/UsuarioModel.js';

const JWT_SECRET = process.env.JWT_SECRET || global.__MODASOFT_SESSION_SECRET || 'modasoft_secret';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔐 Iniciando autenticación para ruta:', req.path);
    console.log('📋 Headers recibidos:', req.headers);
    
    // 1. Obtener token de múltiples fuentes posibles
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
    console.log('🔍 Auth header encontrado:', authHeader);
    
    if (!authHeader) {
      console.log('❌ No se encontró cabecera Authorization');
      return res.status(401).json({ 
        success: false,
        message: 'Token no provisto',
        debug: `Ruta: ${req.path}, Método: ${req.method}`
      });
    }

    // 2. Extraer token
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    
    if (!token || token === 'null' || token === 'undefined') {
      console.log('❌ Token vacío o inválido:', token);
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido'
      });
    }

    console.log('🔑 Token recibido (primeros 20 chars):', token.substring(0, 20) + '...');

    // 3. Verificar token
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token válido. Payload:', payload);
    } catch (jwtError) {
      console.error('❌ Error verificando JWT:', jwtError.message);
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido o expirado',
        error: jwtError.message
      });
    }
    
    if (!payload || !payload.id_usuario) {
      console.log('❌ Payload inválido:', payload);
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }

    // 4. Buscar usuario en BD para obtener información actualizada
    console.log('🔍 Buscando usuario en BD con ID:', payload.id_usuario);
    let userFull;
    try {
      userFull = await UsuariosModel.findByPk(payload.id_usuario, {
        attributes: { exclude: ['password_hash'] },
        raw: true
      });
      
      if (userFull) {
        console.log('✅ Usuario encontrado en BD:', userFull);
        
        // 5. Adjuntar información del usuario a la request
        req.user = {
          id_usuario: userFull.id_usuario,
          usuario: userFull.usuario,
          id_rol: userFull.id_rol,
          // Adjuntar información adicional si es necesario
          ...userFull
        };
        
        req.userFull = userFull;
        
        console.log('📋 req.user establecido:', req.user);
      } else {
        console.log('⚠️ Usuario no encontrado en BD');
        return res.status(401).json({ 
          success: false,
          message: 'Usuario no encontrado en el sistema'
        });
      }
    } catch (dbError) {
      console.error('❌ Error al buscar usuario en BD:', dbError.message);
      return res.status(500).json({ 
        success: false,
        message: 'Error interno al verificar usuario'
      });
    }

    next();
  } catch (err) {
    console.error('❌ Error general en authenticateToken:', err.message, err.stack);
    return res.status(500).json({ 
      success: false,
      message: 'Error de autenticación',
      error: err.message
    });
  }
}