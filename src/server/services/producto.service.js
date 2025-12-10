import ProductoModel from '../../models/ProductoModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import MarcaModel from '../../models/MarcaModel.js';
import CategoriaModel from '../../models/CategoriaModel.js';
import InventarioModel from '../../models/InventarioModel.js';
import DetalleVentaModel from '../../models/DetalleVentaModel.js';
import VentaModel from '../../models/VentaModel.js';
import { Op } from 'sequelize';

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
        if (!data.nombre || !data.id_categoria || !data.id_marca) {
            throw new Error("Nombre, Categoría y Marca son obligatorios para registrar un producto.");
        }

        const nuevoProducto = await ProductoModel.create(data);
        return nuevoProducto;
    } catch (error) {
        console.error("Error al registrar producto principal:", error);
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

export const obtenerTodasLasVariantes = async () => {
    try {
        const variantes = await VarianteProductoModel.findAll({
            include: [
                {
                    model: ProductoModel,
                    as: 'ProductoPrincipal',
                    attributes: ['nombre']
                }
            ],
            order: [['id_variante', 'ASC']]
        });
        return variantes;
    } catch (error) {
        console.error("Error al obtener las variantes:", error);
        throw new Error("No se pudo obtener la lista de variantes.");
    }
};

export const obtenerVariantePorId = async (id_variante) => {
    try {
        const variante = await VarianteProductoModel.findByPk(id_variante, {
            include: [
                {
                    model: ProductoModel,
                    as: 'ProductoPrincipal',
                    attributes: ['nombre']
                }
            ]
        });
        return variante;
    } catch (error) {
        console.error("Error al obtener variante por ID:", error);
        throw new Error("Error al obtener la variante.");
    }
};

export const registrarVarianteProducto = async (data) => {
    try {
        if (!data.id_producto || !data.sku || data.precio_venta <= 0) {
            throw new Error("El ID del Producto, SKU y Precio de Venta son obligatorios.");
        }

        const varianteData = {
            id_producto: data.id_producto,
            codigo_barras: data.sku,
            talla: data.talla,
            color: data.color,
            precio_unitario_venta: data.precio_venta
        };

        const nuevaVariante = await VarianteProductoModel.create(varianteData);
        
        // Crear registro inicial en inventario
        await InventarioModel.create({
            id_variante: nuevaVariante.id_variante,
            tipo: 'entrada',
            cantidad: data.stock_actual || 0,
            stock_actual: data.stock_actual || 0,
            stock_minimo: data.stock_minimo || 10,
            fecha_ultima_entrada: new Date(),
            referencia: 'creacion_variante',
            id_usuario: data.id_usuario || 1
        });

        return nuevaVariante;

    } catch (error) {
        console.error("Error al registrar variante de producto:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`El SKU '${data.sku}' ya existe para otra variante.`);
        }
        throw error;
    }
};

export const obtenerProductosPrincipales = async () => {
    try {
        const productos = await ProductoModel.findAll({
            attributes: ['id_producto', 'nombre'],
            include: [
                {
                    model: MarcaModel,
                    as: 'Marca',
                    attributes: ['nombre'],
                    required: false
                },
                {
                    model: CategoriaModel,
                    as: 'Categoria',
                    attributes: ['nombre'],
                    required: false
                }
            ],
            order: [['nombre', 'ASC']]
        });
        return productos;
    } catch (error) {
        console.error("Error al obtener la lista de productos principales:", error);
        throw new Error("No se pudo obtener la lista de productos principales.");
    }
};

export const actualizarStockVariante = async (codigoBarras, cantidad) => {
    try {
        const variante = await VarianteProductoModel.findOne({
            where: { codigo_barras: codigoBarras }
        });

        if (!variante) {
            throw new Error(`Variante con código de barras ${codigoBarras} no encontrada.`);
        }

        // Obtener el inventario actual
        let inventario = await InventarioModel.findOne({
            where: { id_variante: variante.id_variante }
        });

        const nuevoStock = inventario ? inventario.stock_actual + cantidad : cantidad;

        if (nuevoStock < 0) {
            throw new Error(`Operación inválida: El stock para código de barras ${codigoBarras} no puede ser negativo. Stock actual: ${inventario ? inventario.stock_actual : 0}`);
        }

        // Actualizar inventario
        if (inventario) {
            inventario.stock_actual = nuevoStock;
            inventario.fecha_ultima_entrada = new Date();
            await inventario.save();
        } else {
            // Crear registro de inventario si no existe
            inventario = await InventarioModel.create({
                id_variante: variante.id_variante,
                tipo: cantidad > 0 ? 'entrada' : 'salida',
                cantidad: Math.abs(cantidad),
                stock_actual: nuevoStock,
                stock_minimo: 10,
                fecha_ultima_entrada: new Date(),
                referencia: 'ajuste_manual',
                id_usuario: 1
            });
        }

        return { variante, inventario };
    } catch (error) {
        console.error("Error en servicio al modificar stock de variante:", error);
        throw error;
    }
};

export const obtenerProductosMasVendidos = async (limite = 10, fechaInicio, fechaFin) => {
    try {
        console.log('📦 Obteniendo productos más vendidos (versión simple)...');
        
        // Primero, obtenemos todas las ventas en el período
        const whereVenta = {};
        
        if (fechaInicio && fechaFin) {
            whereVenta.fecha = {
                [Op.between]: [fechaInicio, fechaFin]
            };
        }
        
        // Obtener detalles de venta con sus relaciones
            const detallesVenta = await DetalleVentaModel.findAll({
                include: [
                    {
                        model: VentaModel,
                        as: 'Venta',
                        where: whereVenta,
                        attributes: ['fecha']
                    },
                {
                    model: VarianteProductoModel,
                    as: 'VarianteProducto',
                    attributes: ['talla', 'color', 'codigo_barras'],
                    include: [
                        {
                            model: ProductoModel,
                            as: 'ProductoPrincipal',
                            attributes: ['nombre']
                        }
                    ]
                }
            ],
            raw: true,
            nest: true
        });
        
        // Agrupar productos manualmente
        const productosAgrupados = {};
        
        detallesVenta.forEach(detalle => {
            const productoId = detalle.VarianteProducto?.ProductoPrincipal?.id_producto;
            const productoNombre = detalle.VarianteProducto?.ProductoPrincipal?.nombre || 'Producto Desconocido';
            const cantidad = detalle.cantidad || 0;
            
            if (productoId) {
                if (!productosAgrupados[productoId]) {
                    productosAgrupados[productoId] = {
                        id_producto: productoId,
                        nombre: productoNombre,
                        total_vendido: 0,
                        monto_total: 0,
                        variantes: []
                    };
                }
                
                productosAgrupados[productoId].total_vendido += cantidad;
                productosAgrupados[productoId].monto_total += cantidad * (detalle.precio_unitario_venta || 0);
                
                // Agregar variante si no existe
                const varianteInfo = `${detalle.VarianteProducto?.talla} - ${detalle.VarianteProducto?.color}`;
                if (!productosAgrupados[productoId].variantes.includes(varianteInfo)) {
                    productosAgrupados[productoId].variantes.push(varianteInfo);
                }
            }
        });
        
        // Convertir a array y ordenar
        const productosArray = Object.values(productosAgrupados)
            .sort((a, b) => b.total_vendido - a.total_vendido)
            .slice(0, limite);
        
        console.log(`✅ Productos procesados: ${productosArray.length}`);
        return productosArray;
    } catch (error) {
        console.error('❌ Error en versión simple:', error);
        throw error;
    }
};

// Función para buscar productos (para compras)
export const buscarProductos = async (termino) => {
    try {
        const productos = await VarianteProductoModel.findAll({
            where: {
                [Op.or]: [
                    { codigo_barras: { [Op.like]: `%${termino}%` } },
                    { '$ProductoPrincipal.nombre$': { [Op.like]: `%${termino}%` } }
                ]
            },
            include: [
                {
                    model: ProductoModel,
                    as: 'ProductoPrincipal',
                    attributes: ['id_producto', 'nombre'],
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
                    ]
                },
                {
                    model: InventarioModel,
                    as: 'Inventario',
                    attributes: ['stock_actual', 'stock_minimo']
                }
            ],
            order: [['codigo_barras', 'ASC']],
            limit: 20
        });
        
        // Formatear respuesta para compras
        const productosFormateados = productos.map(variante => ({
            id_variante: variante.id_variante,
            codigo_barras: variante.codigo_barras,
            talla: variante.talla,
            color: variante.color,
            precio_unitario_venta: variante.precio_unitario_venta,
            producto_nombre: variante.ProductoPrincipal?.nombre || 'Sin nombre',
            categoria: variante.ProductoPrincipal?.Categoria?.nombre || 'Sin categoría',
            marca: variante.ProductoPrincipal?.Marca?.nombre || 'Sin marca',
            stock_actual: variante.Inventario?.stock_actual || 0,
            stock_minimo: variante.Inventario?.stock_minimo || 10
        }));
        
        return productosFormateados;
    } catch (error) {
        console.error("Error al buscar productos:", error);
        throw new Error("No se pudo realizar la búsqueda de productos.");
    }
};

// Función para obtener productos con stock bajo (para compras)
export const obtenerProductosBajoStock = async () => {
    try {
        const productos = await VarianteProductoModel.findAll({
            include: [
                {
                    model: ProductoModel,
                    as: 'ProductoPrincipal',
                    attributes: ['id_producto', 'nombre']
                },
                {
                    model: InventarioModel,
                    as: 'Inventario',
                    where: {
                        stock_actual: {
                            [Op.lte]: Sequelize.col('stock_minimo')
                        }
                    },
                    attributes: ['stock_actual', 'stock_minimo'],
                    required: true
                }
            ],
            order: [[{ model: InventarioModel, as: 'Inventario' }, 'stock_actual', 'ASC']]
        });
        
        // Formatear respuesta
        const productosFormateados = productos.map(variante => ({
            id_variante: variante.id_variante,
            codigo_barras: variante.codigo_barras,
            producto_nombre: variante.ProductoPrincipal?.nombre || 'Sin nombre',
            talla: variante.talla,
            color: variante.color,
            stock_actual: variante.Inventario?.stock_actual || 0,
            stock_minimo: variante.Inventario?.stock_minimo || 10,
            necesita_reponer: (variante.Inventario?.stock_actual || 0) <= (variante.Inventario?.stock_minimo || 10)
        }));
        
        return productosFormateados;
    } catch (error) {
        console.error("Error al obtener productos bajo stock:", error);
        throw new Error("No se pudo obtener los productos con stock bajo.");
    }
};

// Función para obtener variante por código de barras (para compras)
export const obtenerVariantePorCodigoBarras = async (codigo_barras) => {
    try {
        const variante = await VarianteProductoModel.findOne({
            where: { codigo_barras: codigo_barras },
            include: [
                {
                    model: ProductoModel,
                    as: 'ProductoPrincipal',
                    attributes: ['id_producto', 'nombre']
                },
                {
                    model: InventarioModel,
                    as: 'Inventario',
                    attributes: ['stock_actual', 'stock_minimo']
                }
            ]
        });
        
        if (!variante) {
            throw new Error(`Producto con código ${codigo_barras} no encontrado`);
        }
        
        return {
            id_variante: variante.id_variante,
            codigo_barras: variante.codigo_barras,
            talla: variante.talla,
            color: variante.color,
            precio_unitario_venta: variante.precio_unitario_venta,
            producto_nombre: variante.ProductoPrincipal?.nombre || 'Sin nombre',
            stock_actual: variante.Inventario?.stock_actual || 0,
            stock_minimo: variante.Inventario?.stock_minimo || 10
        };
    } catch (error) {
        console.error("Error al obtener variante por código:", error);
        throw error;
    }
};