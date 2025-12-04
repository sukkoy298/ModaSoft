import ClienteModel from '../../models/ClienteModel.js';
import VentaModel from '../../models/VentaModel.js';
import DetalleVentaModel from '../../models/DetalleVentaModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import ProductoModel from '../../models/ProductoModel.js';
import UsuariosModel from '../../models/UsuarioModel.js';
import MovimientoContableModel from '../../models/MovimientoContableModel.js';
import { Op, sequelize } from '../../../db.js';

export const obtenerTopClientes = async (limite = 10, fechaInicio, fechaFin) => {
    try {
        let whereClause = {};
        if (fechaInicio && fechaFin) {
            whereClause.fecha = {
                [Op.between]: [fechaInicio, fechaFin]
            };
        }

        const topClientes = await VentaModel.findAll({
            where: whereClause,
            attributes: [
                'cedula_cliente',
                [sequelize.fn('COUNT', sequelize.col('id_venta')), 'total_ventas'],
                [sequelize.fn('SUM', sequelize.col('total')), 'monto_total'],
                [sequelize.fn('SUM', sequelize.col('subtotal')), 'base_imponible'],
                [sequelize.fn('SUM', sequelize.col('iva')), 'total_iva']
            ],
            include: [{
                model: ClienteModel,
                as: 'Cliente',
                attributes: ['nombre', 'email', 'telefono', 'tipo']
            }],
            group: ['cedula_cliente', 'Cliente.nombre', 'Cliente.email', 'Cliente.telefono', 'Cliente.tipo'],
            order: [[sequelize.literal('monto_total'), 'DESC']],
            limit: parseInt(limite)
        });

        return topClientes;

    } catch (error) {
        console.error("Error al obtener top clientes:", error);
        throw new Error("No se pudo obtener el reporte de top clientes.");
    }
};

export const obtenerClientesPorTipo = async (tipo = null) => {
    try {
        let whereClause = { activo: true };
        if (tipo) {
            whereClause.tipo = tipo;
        }

        const clientes = await ClienteModel.findAll({
            where: whereClause,
            attributes: [
                'cedula', 
                'nombre', 
                'email', 
                'telefono', 
                'tipo',
                'fecha_registro',
                [sequelize.literal('(SELECT COUNT(*) FROM venta WHERE venta.cedula_cliente = cliente.cedula)'), 'total_compras'],
                [sequelize.literal('(SELECT COALESCE(SUM(total), 0) FROM venta WHERE venta.cedula_cliente = cliente.cedula)'), 'monto_total_compras']
            ],
            order: [[sequelize.literal('monto_total_compras'), 'DESC']]
        });

        return clientes;

    } catch (error) {
        console.error("Error al obtener clientes por tipo:", error);
        throw new Error("No se pudo obtener el reporte de clientes por tipo.");
    }
};

export const obtenerHistorialComprasCliente = async (cedula, fechaInicio, fechaFin) => {
    try {
        let whereClause = { cedula_cliente: cedula };
        
        if (fechaInicio && fechaFin) {
            whereClause.fecha = {
                [Op.between]: [fechaInicio, fechaFin]
            };
        }

        const historial = await VentaModel.findAll({
            where: whereClause,
            include: [
                {
                    model: DetalleVentaModel,
                    as: 'Detalles',
                    include: [{
                        model: VarianteProductoModel,
                        as: 'VarianteProducto',
                        include: [{
                            model: ProductoModel,
                            as: 'ProductoPrincipal'
                        }]
                    }]
                },
                {
                    model: UsuariosModel,
                    as: 'Usuario',
                    attributes: ['usuario']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        const cliente = await ClienteModel.findOne({ where: { cedula } });
        
        return {
            cliente,
            historial
        };

    } catch (error) {
        console.error("Error al obtener historial de compras:", error);
        throw new Error("No se pudo obtener el historial de compras del cliente.");
    }
};