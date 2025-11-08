import { Router } from 'express';
import { 
    obtenerTodosLosClientes, 
    obtenerClientePorCedula, 
    actualizarCliente, 
    registrarCliente,
    eliminarCliente 
} from '../services/cliente.service.js';

const router = Router();

// =========================================================
//  RUTA 1: OBTENER TODOS LOS CLIENTES (GET /)
// =========================================================
router.get('/', async (req, res) => {
    try {
        const clientes = await obtenerTodosLosClientes(); 
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error en el listado de la API:', error);
        res.status(500).json({ message: 'Error interno del servidor al listar clientes.' });
    }
});

// =========================================================
//  RUTA 2: OBTENER CLIENTE POR CÉDULA (GET /:cedula)
// =========================================================
router.get('/:cedula', async (req, res) => {
    try {
        const cliente = await obtenerClientePorCedula(req.params.cedula);
        
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado.' }); 
        }
        
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// =========================================================
//  RUTA 3: REGISTRAR NUEVO CLIENTE (POST /)
// =========================================================
router.post('/', async (req, res) => {
    try {
        console.log('📥 Datos recibidos para registro:', req.body);
        
        const nuevoCliente = await registrarCliente(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        
        if (error.message.includes('ya está registrada')) {
            return res.status(409).json({ message: error.message });
        }
        
        res.status(500).json({ message: error.message || 'Error interno del servidor al registrar cliente.' });
    }
});

// =========================================================
//  RUTA 4: ACTUALIZAR CLIENTE (PUT /:cedula)
// =========================================================
router.put('/:cedula', async (req, res) => {
    try {
        const cedula = req.params.cedula;
        const datosActualizados = req.body;
        
        console.log('📥 Datos recibidos para actualizar:', { cedula, datosActualizados });
        
        const resultado = await actualizarCliente(cedula, datosActualizados);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: error.message });
    }
});

// =========================================================
//  RUTA 5: ELIMINAR CLIENTE (DELETE /:cedula)
// =========================================================
router.delete('/:cedula', async (req, res) => {
    try {
        const resultado = await eliminarCliente(req.params.cedula);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;