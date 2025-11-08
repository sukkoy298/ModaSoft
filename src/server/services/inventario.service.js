import InventarioModel from '../../models/InventarioModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import ProductoModel from '../../models/ProductoModel.js';
import { Op, Sequelize } from 'sequelize';

export const obtenerTodoElInventario = async () => {
    try {
        const inventario = await InventarioModel.findAll({
            include: [{
                model: VarianteProductoModel,
                as: 'Variante',
                include: [{
                    model: ProductoModel,
                    as: 'ProductoPrincipal'
                }]
            }],
            order: [['fecha_ultima_entrada', 'DESC']]
        });
        return inventario;
    } catch (error) {
        console.error("Error al obtener el inventario:", error);
        throw new Error("No se pudo obtener el inventario.");
    }
};

export const obtenerProductosBajoStock = async () => {
    try {
        const productosBajoStock = await InventarioModel.findAll({
            where: {
                stock_actual: {
                    [Op.lte]: Sequelize.col('stock_minimo')
                }
            },
            include: [{
                model: VarianteProductoModel,
                as: 'Variante',
                include: [{
                    model: ProductoModel,
                    as: 'ProductoPrincipal'
                }]
            }],
            order: [['stock_actual', 'ASC']]
        });
        return productosBajoStock;
    } catch (error) {
        console.error("Error al obtener productos bajo stock:", error);
        throw new Error("No se pudo obtener los productos con stock bajo.");
    }
};

export const obtenerInventarioPorVariante = async (id_variante) => {
    try {
        const inventario = await InventarioModel.findOne({
            where: { id_variante },
            include: [{
                model: VarianteProductoModel,
                as: 'Variante',
                include: [{
                    model: ProductoModel,
                    as: 'ProductoPrincipal'
                }]
            }]
        });
        return inventario;
    } catch (error) {
        console.error("Error al obtener inventario por variante:", error);
        throw new Error("Error al obtener el registro de inventario.");
    }
};

export const actualizarStock = async (codigoBarras, cantidad) => {
    try {
        // Buscar la variante por código de barras
        const variante = await VarianteProductoModel.findOne({
            where: { codigo_barras: codigoBarras }
        });

        if (!variante) {
            throw new Error(`Variante con código de barras ${codigoBarras} no encontrada`);
        }

        // Buscar o crear registro de inventario
        let inventario = await InventarioModel.findOne({
            where: { id_variante: variante.id_variante }
        });

        const nuevoStock = inventario ? inventario.stock_actual + cantidad : cantidad;

        if (nuevoStock < 0) {
            throw new Error(`Stock no puede ser negativo. Stock actual: ${inventario ? inventario.stock_actual : 0}`);
        }

        if (inventario) {
            inventario.stock_actual = nuevoStock;
            inventario.fecha_ultima_entrada = new Date();
            await inventario.save();
        } else {
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

        return { inventario, variante };
    } catch (error) {
        console.error("Error al actualizar stock:", error);
        throw error;
    }
};

export const ajustarStock = async (id_variante, cantidad, motivo, id_usuario = 1) => {
    try {
        let inventario = await InventarioModel.findOne({
            where: { id_variante }
        });

        const nuevoStock = cantidad;

        if (nuevoStock < 0) {
            throw new Error('El stock no puede ser negativo');
        }

        if (inventario) {
            inventario.stock_actual = nuevoStock;
            inventario.fecha_ultima_entrada = new Date();
            await inventario.save();
        } else {
            inventario = await InventarioModel.create({
                id_variante,
                tipo: 'ajuste',
                cantidad: nuevoStock,
                stock_actual: nuevoStock,
                stock_minimo: 10,
                fecha_ultima_entrada: new Date(),
                referencia: motivo || 'ajuste_manual',
                id_usuario
            });
        }

        return inventario;
    } catch (error) {
        console.error("Error al ajustar stock:", error);
        throw error;
    }
};

export const obtenerMovimientosInventario = async () => {
    try {
        const movimientos = await InventarioModel.findAll({
            include: [{
                model: VarianteProductoModel,
                as: 'Variante',
                include: [{
                    model: ProductoModel,
                    as: 'ProductoPrincipal'
                }]
            }],
            order: [['created_at', 'DESC']]
        });
        return movimientos;
    } catch (error) {
        console.error("Error al obtener movimientos de inventario:", error);
        throw new Error("No se pudo obtener los movimientos de inventario.");
    }
};