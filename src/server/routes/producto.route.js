import express from 'express';
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  registrarProducto,
  registrarVarianteProducto,
  obtenerProductosPrincipales,
  obtenerTodasLasVariantes,
  actualizarStockVariante,
  obtenerProductosMasVendidos
} from '../services/producto.service.js';

const router = express.Router();

// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await obtenerTodosLosProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/productos/principales - Registrar producto principal
router.post('/principales', async (req, res) => {
  try {
    const nuevoProducto = await registrarProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET para obtener variantes
router.get('/variantes', async (req, res) => {
  try {
    const variantes = await obtenerTodasLasVariantes();
    res.json(variantes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/variantes/:id - Obtener variante por ID
router.get('/variantes/:id', async (req, res) => {
  try {
    const variante = await obtenerVariantePorId(req.params.id);
    if (!variante) {
      return res.status(404).json({ message: 'Variante no encontrada' });
    }
    res.json(variante);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// VARIANTES DE PRODUCTO
// POST /api/productos/variantes - Registrar variante de producto
router.post('/variantes', async (req, res) => {
  try {
    const nuevaVariante = await registrarVarianteProducto(req.body);
    res.status(201).json(nuevaVariante);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// STOCK
// PUT /api/productos/stock/:codigoBarras - Actualizar stock
router.put('/stock/:codigoBarras', async (req, res) => {
  try {
    const { cantidad } = req.body;
    const resultado = await actualizarStockVariante(req.params.codigoBarras, cantidad);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CATEGORÍAS
// GET /api/productos/categorias - Obtener todas las categorías
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await obtenerTodasLasCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/mas-vendidos
router.get('/mas-vendidos', async (req, res) => {
    try {
        const { limite = 10, fechaInicio, fechaFin } = req.query;
        console.log('📞 Llamada a productos más vendidos:', { limite, fechaInicio, fechaFin });
        
        let productos;
        
        // Primero intentar con la función principal
        try {
            productos = await obtenerProductosMasVendidos(limite, fechaInicio, fechaFin);
            console.log('✅ Productos obtenidos con función principal');
        } catch (error) {
            console.log('⚠️ Función principal falló', error.message);
        }
        
        // Asegurar formato consistente
        const productosFormateados = productos.map(p => {
            // Si viene de la función simple
            if (p.nombre) {
                return {
                    nombre: p.nombre,
                    total_vendido: p.total_vendido,
                    monto_total: p.monto_total,
                    VarianteProducto: {
                        ProductoPrincipal: {
                            nombre: p.nombre
                        }
                    }
                };
            }
            // Si viene de la función principal
            return p;
        });
        
        res.json({
            success: true,
            count: productosFormateados.length,
            data: productosFormateados
        });
        
    } catch (error) {
        console.error('❌ Error en ruta /mas-vendidos:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: 'Error al obtener productos más vendidos'
        });
    }
});


export default router;