import ProductoModel from '../../models/ProductoModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import InventarioModel from '../../models/InventarioModel.js';
import DetalleVentaModel from '../../models/DetalleVentaModel.js';
import VentaModel from '../../models/VentaModel.js';
import { Op, fn, col, literal } from 'sequelize';

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

        // Para debug - ver qué está devolviendo Sequelize
        console.log("🔍 DEBUG - Primer producto completo:", JSON.stringify(productos[0], null, 2));

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
                    as: 'VentaPrincipal',
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