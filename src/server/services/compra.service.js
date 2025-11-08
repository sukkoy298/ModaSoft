import CompraModel from '../../models/CompraModel.js';
import DetalleCompraModel from '../../models/DetalleCompraModel.js';
import ProveedorModel from '../../models/ProveedorModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import InventarioModel from '../../models/InventarioModel.js';
import { Op } from 'sequelize';

export const obtenerTodasLasCompras = async () => {
    try {
        const compras = await CompraModel.findAll({
            include: [
                {
                    model: ProveedorModel,
                    as: 'Proveedor',
                    attributes: ['nombre', 'doc_identidad']
                }
            ],
            order: [['fecha', 'DESC']]
        });
        return compras;
    } catch (error) {
        console.error("Error al obtener las compras:", error);
        throw new Error("No se pudo obtener la lista de compras.");
    }
};

export const obtenerCompraPorId = async (id_compra) => {
    try {
        const compra = await CompraModel.findByPk(id_compra, {
            include: [
                {
                    model: ProveedorModel,
                    as: 'Proveedor',
                    attributes: ['nombre', 'doc_identidad']
                },
                {
                    model: DetalleCompraModel,
                    as: 'Detalles',
                    include: [{
                        model: VarianteProductoModel,
                        as: 'Variante'
                    }]
                }
            ]
        });
        return compra;
    } catch (error) {
        console.error("Error al obtener compra por ID:", error);
        throw new Error("Error al obtener la compra.");
    }
};

export const registrarCompra = async (compraData) => {
    const transaction = await CompraModel.sequelize.transaction();
    
    try {
        // 1. Crear la compra principal
        const nuevaCompra = await CompraModel.create({
            cedula_proveedor: compraData.cedula_proveedor,
            fecha: new Date(),
            nro_factura: compraData.nro_factura,
            total: compraData.total,
            id_usuario: compraData.id_usuario || 1
        }, { transaction });

        // 2. Crear los detalles de compra y actualizar inventario
        for (const detalle of compraData.detalles) {
            // Crear detalle de compra
            await DetalleCompraModel.create({
                id_compra: nuevaCompra.id_compra,
                id_variante: detalle.id_variante,
                cantidad: detalle.cantidad,
                precio_unitario_costo: detalle.precio_unitario_costo
            }, { transaction });

            // Actualizar inventario (aumentar stock)
            let inventario = await InventarioModel.findOne({
                where: { id_variante: detalle.id_variante },
                transaction
            });

            if (inventario) {
                inventario.stock_actual += detalle.cantidad;
                inventario.fecha_ultima_entrada = new Date();
                await inventario.save({ transaction });
            } else {
                await InventarioModel.create({
                    id_variante: detalle.id_variante,
                    tipo: 'entrada',
                    cantidad: detalle.cantidad,
                    stock_actual: detalle.cantidad,
                    stock_minimo: 10,
                    fecha_ultima_entrada: new Date(),
                    referencia: `compra_${nuevaCompra.id_compra}`,
                    id_usuario: compraData.id_usuario || 1
                }, { transaction });
            }
        }

        await transaction.commit();
        return nuevaCompra;

    } catch (error) {
        await transaction.rollback();
        console.error("Error al registrar compra:", error);
        throw error;
    }
};

export const obtenerComprasPorProveedor = async (doc_identidad) => {
    try {
        const compras = await CompraModel.findAll({
            where: { cedula_proveedor: doc_identidad },
            include: [
                {
                    model: ProveedorModel,
                    as: 'Proveedor',
                    attributes: ['nombre', 'doc_identidad']
                }
            ],
            order: [['fecha', 'DESC']]
        });
        return compras;
    } catch (error) {
        console.error("Error al obtener compras por proveedor:", error);
        throw new Error("Error al obtener las compras del proveedor.");
    }
};