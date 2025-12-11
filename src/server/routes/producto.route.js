import express from 'express';
import {
  obtenerInventarioCompleto,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  registrarProducto,
  registrarVarianteProducto,
  obtenerProductosPrincipales,
  obtenerTodasLasVariantes,
  actualizarStockVariante,
  obtenerProductosMasVendidos,
  buscarProductos,
  obtenerProductosBajoStock,
  obtenerVariantePorCodigoBarras
} from '../services/producto.service.js';
import { obtenerTodasLasCategorias } from '../services/categoria.service.js';

const router = express.Router();
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';

// GET /api/productos - Obtener todos los productos principales
router.get('/', authenticateToken, async (req, res) => {
  try {
    const productos = await obtenerProductosPrincipales();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/productos/ - Registrar producto principal
router.post('/', authenticateToken, authorizeRoles([1, 3]), async (req, res) => {
  try {
    const nuevoProducto = await registrarProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET para obtener variantes
router.get('/variantes', authenticateToken, async (req, res) => {
  try {
    const variantes = await obtenerTodasLasVariantes();
    res.json(variantes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/variantes/:id - Obtener variante por ID
router.get('/variantes/:id', authenticateToken, async (req, res) => {
  try {
    const variante = await obtenerVariantePorId(req.params.id);
    if (!variante) {
      return res.status(404).json({ message: 'Variante no encontrada' });
    }
    res.json(variante);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VARIANTES DE PRODUCTO
// POST /api/productos/variantes - Registrar variante de producto
router.post('/variantes', authenticateToken, authorizeRoles([1, 3]), async (req, res) => {
  try {
    const nuevaVariante = await registrarVarianteProducto(req.body);
    res.status(201).json(nuevaVariante);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// STOCK
// PUT /api/productos/stock/:codigoBarras - Actualizar stock
router.put('/stock/:codigoBarras', authenticateToken, authorizeRoles([1, 3]), async (req, res) => {
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
router.get('/categorias', authenticateToken, async (req, res) => {
  try {
    const categorias = await obtenerTodasLasCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/mas-vendidos
router.get('/mas-vendidos', authenticateToken, async (req, res) => {
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

// GET /api/productos/inventario - Obtener inventario completo
router.get('/inventario', authenticateToken, async (req, res) => {
  try {
    const inventario = await obtenerInventarioCompleto();
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const producto = await obtenerProductoPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', authenticateToken, authorizeRoles([1, 3]), async (req, res) => {
  try {
    const productoActualizado = await actualizarProducto(req.params.id, req.body);
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', authenticateToken, authorizeRoles([1, 3]), async (req, res) => {
  try {
    const resultado = await eliminarProducto(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/productos/buscar/:termino - Buscar productos para compras
router.get('/buscar/:termino', authenticateToken, async (req, res) => {
  try {
    const productos = await buscarProductos(req.params.termino);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/bajo-stock - Productos con stock bajo
router.get('/bajo-stock', authenticateToken, async (req, res) => {
  try {
    const productos = await obtenerProductosBajoStock();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/codigo/:codigo_barras - Buscar por código de barras
router.get('/codigo/:codigo_barras', authenticateToken, async (req, res) => {
  try {
    const producto = await obtenerVariantePorCodigoBarras(req.params.codigo_barras);
    res.json(producto);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;