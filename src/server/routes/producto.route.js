import { Router } from 'express';
//  Importación de funciones necesarias para la escritura
import { 
    obtenerTodoElInventario,
    registrarProducto,
    registrarVarianteProducto,
    obtenerProductosPrincipales,
    actualizarStockVariante
} from '../../producto.service.js';

const router = Router();

// ----------------------------------------------------------------------
// 1. RUTA DE LECTURA (TÚ CÓDIGO EXISTENTE)
// ----------------------------------------------------------------------

router.get('/', async (req, res) => {
    try {
        const inventario = await obtenerTodoElInventario();
        res.status(200).json(inventario); 
    } catch (error) {
        console.error("Error en la ruta GET /api/productos:", error);
        res.status(500).json({ 
            message: "Error al obtener el inventario", 
            error: error.message 
        });
    }
});


// ----------------------------------------------------------------------
// 2. RUTA DE LECTURA ESPECÍFICA: LISTA PRODUCTOS PRINCIPALES PARA SELECTS
// ----------------------------------------------------------------------
router.get('/principales', async (req, res) => {
    try {
        const productos = await obtenerProductosPrincipales();
        res.status(200).json(productos); 
    } catch (error) {
        // Se añade el error al log para debug
        console.error("Error al listar productos principales:", error);
        res.status(500).json({ 
            message: "Error al listar productos principales", 
            error: error.message 
        });
    }
});

// ----------------------------------------------------------------------
// 3. RUTAS DE ESCRITURA (FUNCIONALIDAD AÑADIDA)
// ----------------------------------------------------------------------

// 3.1. POST para Producto Principal (Nombre, Categoría, Marca)
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = await registrarProducto(req.body);
        res.status(201).json({ 
            message: "Producto principal registrado con éxito.",
            id_producto: nuevoProducto.id_producto,
            producto: nuevoProducto 
        });
    } catch (error) {
        console.error("Error en la ruta POST /api/productos:", error);
        res.status(400).json({ 
            message: "Fallo al registrar el producto.",
            error: error.message 
        });
    }
});


// 3.2. POST para Variantes (SKU, Talla, Color, Precio)
router.post('/variantes', async (req, res) => {
    try {
        const nuevaVariante = await registrarVarianteProducto(req.body);
        res.status(201).json({ 
            message: "Variante de producto registrada con éxito.",
            codigo_barras: nuevaVariante.codigo_barras,
            variante: nuevaVariante
        });
    } catch (error) {
        console.error("Error en la ruta POST /api/productos/variantes:", error);
        res.status(400).json({ 
            message: "Fallo al registrar la variante del producto.",
            error: error.message 
        });
    }
});


// 3.3. PUT para Actualización de Stock (Entradas/Salidas)
router.put('/variantes/stock/:codigoBarras', async (req, res) => {
    const { codigoBarras } = req.params;
    const { cantidad } = req.body; 

    if (typeof cantidad !== 'number' || cantidad === 0) {
        return res.status(400).json({ message: "La 'cantidad' debe ser un número diferente de cero." });
    }

    try {
        const varianteActualizada = await actualizarStockVariante(codigoBarras, cantidad);
        
        res.status(200).json({ 
            message: `Stock de código de barras ${codigoBarras} actualizado. Nuevo stock: ${varianteActualizada.stock_actual}`,
            variante: varianteActualizada
        });
    } catch (error) {
        console.error(`Error en la ruta PUT /api/productos/variantes/stock/${codigoBarras}:`, error);
        const statusCode = error.message.includes('no encontrada') ? 404 : 400;
        res.status(statusCode).json({ 
            message: "Fallo al actualizar el stock.",
            error: error.message 
        });
    }
});

export default router;