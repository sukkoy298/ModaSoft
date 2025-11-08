import VentaModel from '../../models/VentaModel.js';
import DetalleVentaModel from '../../models/DetalleVentaModel.js';
import ClienteModel from '../../models/ClienteModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import InventarioModel from '../../models/InventarioModel.js';

export const registrarVenta = async (ventaData) => {
    const transaction = await VentaModel.sequelize.transaction();
    
    try {
        // 1. Crear la venta principal
        const nuevaVenta = await VentaModel.create({
            cedula_cliente: ventaData.cedula_cliente,
            fecha: new Date(),
            total: ventaData.total,
            estado: 'pagada',
            id_usuario: ventaData.id_usuario || 1
        }, { transaction });

        // 2. Crear los detalles de venta y actualizar inventario
        for (const detalle of ventaData.detalles) {
            // Crear detalle de venta
            await DetalleVentaModel.create({
                id_venta: nuevaVenta.id_venta,
                id_variante: detalle.id_variante,
                id_metodo: detalle.id_metodo,
                cantidad: detalle.cantidad,
                precio_unitario_venta: detalle.precio_unitario_venta
            }, { transaction });

            // Actualizar inventario (reducir stock)
            const inventario = await InventarioModel.findOne({
                where: { id_variante: detalle.id_variante },
                transaction
            });

            if (inventario) {
                const nuevoStock = inventario.stock_actual - detalle.cantidad;
                if (nuevoStock < 0) {
                    throw new Error(`Stock insuficiente para la variante ${detalle.id_variante}`);
                }

                await InventarioModel.update({
                    stock_actual: nuevoStock,
                    fecha_ultima_entrada: new Date()
                }, {
                    where: { id_variante: detalle.id_variante },
                    transaction
                });
            }
        }

        await transaction.commit();
        return nuevaVenta;

    } catch (error) {
        await transaction.rollback();
        console.error("Error al registrar venta:", error);
        throw error;
    }
};

export const obtenerTodasLasVentas = async () => {
    try {
        const ventas = await VentaModel.findAll({
            include: [
                {
                    model: ClienteModel,
                    as: 'Cliente',
                    attributes: ['nombre', 'cedula']
                }
            ],
            order: [['fecha', 'DESC']]
        });
        return ventas;
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        throw new Error("No se pudo obtener la lista de ventas.");
    }
};

export const obtenerVentaPorId = async (id_venta) => {
    try {
        const venta = await VentaModel.findByPk(id_venta, {
            include: [
                {
                    model: ClienteModel,
                    as: 'Cliente',
                    attributes: ['nombre', 'cedula']
                },
                {
                    model: DetalleVentaModel,
                    as: 'Detalles',
                    include: [{
                        model: VarianteProductoModel,
                        as: 'VarianteProducto'
                    }]
                }
            ]
        });
        return venta;
    } catch (error) {
        console.error("Error al obtener venta por ID:", error);
        throw new Error("Error al obtener la venta.");
    }
};

export const obtenerDetalleVenta = async (id_venta) => {
    try {
        const venta = await VentaModel.findByPk(id_venta, {
            include: [
                {
                    model: ClienteModel,
                    as: 'Cliente',
                    attributes: ['nombre', 'cedula', 'telefono', 'email']
                },
                {
                    model: DetalleVentaModel,
                    as: 'Detalles',
                    include: [{
                        model: VarianteProductoModel,
                        as: 'VarianteProducto',
                        include: [{
                            model: ProductoModel,
                            as: 'ProductoPrincipal',
                            attributes: ['nombre']
                        }]
                    }]
                }
            ]
        });
        return venta;
    } catch (error) {
        console.error("Error al obtener detalle de venta:", error);
        throw new Error("Error al obtener el detalle de la venta.");
    }
};

export const anularVenta = async (id_venta) => {
    const transaction = await VentaModel.sequelize.transaction();
    
    try {
        const venta = await VentaModel.findByPk(id_venta);
        if (!venta) {
            throw new Error('Venta no encontrada');
        }

        if (venta.estado === 'anulada') {
            throw new Error('La venta ya está anulada');
        }

        // Cambiar estado a anulada
        venta.estado = 'anulada';
        await venta.save({ transaction });

        // Devolver productos al inventario
        const detalles = await DetalleVentaModel.findAll({
            where: { id_venta },
            transaction
        });

        for (const detalle of detalles) {
            const inventario = await InventarioModel.findOne({
                where: { id_variante: detalle.id_variante },
                transaction
            });

            if (inventario) {
                inventario.stock_actual += detalle.cantidad;
                inventario.fecha_ultima_entrada = new Date();
                await inventario.save({ transaction });
            }
        }

        await transaction.commit();
        return venta;

    } catch (error) {
        await transaction.rollback();
        console.error("Error al anular venta:", error);
        throw error;
    }
};

export const obtenerVentasPorFecha = async (fecha) => {
    try {
        const ventas = await VentaModel.findAll({
            where: {
                fecha: fecha
            },
            include: [
                {
                    model: ClienteModel,
                    as: 'Cliente',
                    attributes: ['nombre', 'cedula']
                }
            ],
            order: [['fecha', 'DESC']]
        });
        return ventas;
    } catch (error) {
        console.error("Error al obtener ventas por fecha:", error);
        throw new Error("Error al obtener las ventas de la fecha especificada.");
    }
};