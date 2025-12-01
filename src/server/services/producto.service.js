import ProductoModel from '../../models/ProductoModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import InventarioModel from '../../models/InventarioModel.js';
import CategoriaModel from '../../models/CategoriaModel.js';
import MarcaModel from '../../models/MarcaModel.js';

export const obtenerInventarioCompleto = async () => {
  try {
    const productos = await ProductoModel.findAll({
      include: [
        {
          model: CategoriaModel,
          as: 'Categoria',
          attributes: ['nombre']
        },
        {
          model: MarcaModel,
          as: 'Marca',
          attributes: ['nombre']
        },
        {
          model: VarianteProductoModel,
          as: 'Variantes',
          // Asegúrate de seleccionar explícitamente precio_unitario_venta
          attributes: ['id_variante', 'talla', 'color', 'codigo_barras', 'precio_unitario_venta'], 
          include: [{
            model: InventarioModel,
            as: 'Inventario',
            attributes: ['stock_actual']
          }]
        }
      ],
      order: [['nombre', 'ASC']]
    });

    // Formatear los datos para el frontend
    const inventarioFormateado = productos.map(producto => {
      const variantesFormateadas = producto.Variantes?.map(variante => ({
        id_variante: variante.id_variante,
        sku: variante.codigo_barras, // Usar codigo_barras como sku
        talla: variante.talla,
        color: variante.color,
        precio_unitario_venta: variante.precio_unitario_venta, // <-- CORREGIDO: Usar el nombre exacto
        stock_actual: variante.Inventario?.stock_actual || 0
      })) || [];

      return {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.Categoria?.nombre,
        marca: producto.Marca?.nombre,
        variantes: variantesFormateadas
      };
    });

    return inventarioFormateado;
  } catch (error) {
    console.error("Error al obtener inventario completo:", error);
    throw new Error("No se pudo obtener el inventario.");
  }
};

export const obtenerTodosLosProductos = async () => {
  try {
    const productos = await ProductoModel.findAll({
      include: [
        {
          model: CategoriaModel,
          as: 'Categoria',
          attributes: ['nombre']
        },
        {
          model: MarcaModel,
          as: 'Marca',
          attributes: ['nombre']
        }
      ],
      order: [['nombre', 'ASC']]
    });
    return productos;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw new Error("No se pudo obtener la lista de productos.");
  }
};

export const obtenerProductoPorId = async (id_producto) => {
  try {
    const producto = await ProductoModel.findByPk(id_producto, {
      include: [
        {
          model: CategoriaModel,
          as: 'Categoria',
          attributes: ['nombre']
        },
        {
          model: MarcaModel,
          as: 'Marca',
          attributes: ['nombre']
        },
        {
          model: VarianteProductoModel,
          as: 'Variantes',
          include: [{
            model: InventarioModel,
            as: 'Inventario',
            attributes: ['stock_actual']
          }]
        }
      ]
    });
    return producto;
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    throw new Error("Error al obtener el producto.");
  }
};

export const registrarProducto = async (data) => {
  try {
    const nuevoProducto = await ProductoModel.create(data);
    return nuevoProducto;
  } catch (error) {
    console.error("Error al registrar producto:", error);
    throw error;
  }
};

export const actualizarProducto = async (id_producto, datos) => {
  try {
    const producto = await ProductoModel.findByPk(id_producto);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    await producto.update(datos);
    return producto;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

export const eliminarProducto = async (id_producto) => {
  try {
    const producto = await ProductoModel.findByPk(id_producto);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    await producto.destroy();
    return { message: 'Producto eliminado correctamente' };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};