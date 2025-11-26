import ProductoModel from '../../models/ProductoModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import MarcaModel from '../../models/MarcaModel.js';
import CategoriaModel from '../../models/CategoriaModel.js';
import InventarioModel from '../../models/InventarioModel.js';

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