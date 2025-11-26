import DevolucionModel from '../../models/DevolucionModel.js';
import DetalleDevolucionModel from '../../models/DetalleDevolucionModel.js';
import VentaModel from '../../models/VentaModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import InventarioModel from '../../models/InventarioModel.js';

export const obtenerTodasLasDevoluciones = async () => {
    try {
        const devoluciones = await DevolucionModel.findAll({
            include: [
                {
                    model: VentaModel,
                    as: 'Venta',
                    attributes: ['id_venta', 'total']
                }
            ],
            order: [['fecha', 'DESC']]
        });
        return devoluciones;
    } catch (error) {
        console.error("Error al obtener las devoluciones:", error);
        throw new Error("No se pudo obtener la lista de devoluciones.");
    }
};

export const obtenerDevolucionPorId = async (id_devolucion) => {
    try {
        const devolucion = await DevolucionModel.findByPk(id_devolucion, {
            include: [
                {
                    model: VentaModel,
                    as: 'Venta',
                    attributes: ['id_venta', 'total']
                },
                {
                    model: DetalleDevolucionModel,
                    as: 'Detalles',
                    include: [{
                        model: VarianteProductoModel,
                        as: 'Variante'
                    }]
                }
            ]
        });
        return devolucion;
    } catch (error) {
        console.error("Error al obtener devolución por ID:", error);
        throw new Error("Error al obtener la devolución.");
    }
};

export const registrarDevolucion = async (devolucionData) => {
    const transaction = await DevolucionModel.sequelize.transaction();
    
    try {
        // 1. Crear la devolución principal
        const nuevaDevolucion = await DevolucionModel.create({
            id_venta: devolucionData.id_venta,
            fecha: new Date(),
            motivo: devolucionData.motivo,
            id_usuario: devolucionData.id_usuario || 1
        }, { transaction });

        // 2. Crear los detalles de devolución y actualizar inventario
        for (const detalle of devolucionData.detalles) {
            // Crear detalle de devolución
            await DetalleDevolucionModel.create({
                id_devolucion: nuevaDevolucion.id_devolucion,
                id_variante: detalle.id_variante,
                cantidad: detalle.cantidad
            }, { transaction });

            // Actualizar inventario (devolver stock)
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
        return nuevaDevolucion;

    } catch (error) {
        await transaction.rollback();
        console.error("Error al registrar devolución:", error);
        throw error;
    }
};

export const obtenerDevolucionesPorVenta = async (id_venta) => {
    try {
        const devoluciones = await DevolucionModel.findAll({
            where: { id_venta },
            include: [
                {
                    model: VentaModel,
                    as: 'Venta',
                    attributes: ['id_venta', 'total']
                }
            ],
            order: [['fecha', 'DESC']]
        });
        return devoluciones;
    } catch (error) {
        console.error("Error al obtener devoluciones por venta:", error);
        throw new Error("Error al obtener las devoluciones de la venta.");
    }
};