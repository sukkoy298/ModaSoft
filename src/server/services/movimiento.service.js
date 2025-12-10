import MovimientoContableModel from '../../models/MovimientoContableModel.js';
import CatalogoCuentaModel from '../../models/CatalogoCuentaModel.js';
import { Op } from 'sequelize';
import { sequelize } from '../../../db.js';

export const obtenerMovimientos = async (fecha_inicio, fecha_fin, codigo_cuenta) => {
    try {
        const where = {};
        
        // Filtrar por fechas
        if (fecha_inicio && fecha_fin) {
            const inicio = new Date(fecha_inicio);
            const fin = new Date(fecha_fin);
            fin.setHours(23, 59, 59, 999);
            where.fecha_movimiento = { [Op.between]: [inicio, fin] };
        }

        // Filtrar por código de cuenta
        if (codigo_cuenta) {
            where.codigo_cuenta = codigo_cuenta;
        }

        const movimientos = await MovimientoContableModel.findAll({
            where,
            include: [{
                model: CatalogoCuentaModel,
                as: 'Cuenta',
                attributes: ['codigo', 'nombre', 'tipo']
            }],
            order: [['fecha_movimiento', 'DESC'], ['created_at', 'DESC']]
        });

        return movimientos;
    } catch (error) {
        console.error('Error obtenerMovimientos:', error);
        throw error;
    }
};

export const obtenerMovimientosConFiltros = async (filtros = {}) => {
    try {
        const where = {};
        
        const { fecha_inicio, fecha_fin, codigo_cuenta, tipo } = filtros;
        
        // Filtrar por fechas
        if (fecha_inicio && fecha_fin) {
            const inicio = new Date(fecha_inicio);
            const fin = new Date(fecha_fin);
            fin.setHours(23, 59, 59, 999);
            where.fecha_movimiento = { [Op.between]: [inicio, fin] };
        }

        // Filtrar por código de cuenta
        if (codigo_cuenta) {
            where.codigo_cuenta = codigo_cuenta;
        }

        // Filtrar por tipo (debe/haber)
        if (tipo === 'debe') {
            where.debe = { [Op.gt]: 0 };
        } else if (tipo === 'haber') {
            where.haber = { [Op.gt]: 0 };
        }

        const movimientos = await MovimientoContableModel.findAll({
            where,
            include: [{
                model: CatalogoCuentaModel,
                as: 'Cuenta',
                attributes: ['codigo', 'nombre', 'tipo']
            }],
            order: [['fecha_movimiento', 'DESC'], ['created_at', 'DESC']]
        });

        return movimientos;
    } catch (error) {
        console.error('Error obtenerMovimientosConFiltros:', error);
        throw error;
    }
};

export const obtenerResumenContable = async (fecha_inicio, fecha_fin) => {
    try {
        const where = {};
        
        if (fecha_inicio && fecha_fin) {
            const inicio = new Date(fecha_inicio);
            const fin = new Date(fecha_fin);
            fin.setHours(23, 59, 59, 999);
            where.fecha_movimiento = { [Op.between]: [inicio, fin] };
        }

        const movimientos = await MovimientoContableModel.findAll({
            where,
            attributes: [
                'codigo_cuenta',
                [sequelize.fn('SUM', sequelize.col('debe')), 'total_debe'],
                [sequelize.fn('SUM', sequelize.col('haber')), 'total_haber']
            ],
            group: ['codigo_cuenta'],
            include: [{
                model: CatalogoCuentaModel,
                as: 'Cuenta',
                attributes: ['nombre', 'tipo']
            }],
            raw: true,
            nest: true
        });

        // Calcular totales generales
        let totalDebe = 0;
        let totalHaber = 0;

        movimientos.forEach(mov => {
            totalDebe += parseFloat(mov.total_debe) || 0;
            totalHaber += parseFloat(mov.total_haber) || 0;
        });

        return {
            movimientos,
            totalDebe,
            totalHaber,
            diferencia: totalDebe - totalHaber
        };
    } catch (error) {
        console.error('Error obtenerResumenContable:', error);
        throw error;
    }
};

export const registrarMovimiento = async (data) => {
    try {
        if (!data.fecha_movimiento || !data.codigo_cuenta || (!data.debe && !data.haber)) {
            throw new Error('fecha_movimiento, codigo_cuenta y (debe o haber) son requeridos');
        }

        // Verificar que la cuenta existe
        const cuenta = await CatalogoCuentaModel.findOne({
            where: { codigo: data.codigo_cuenta, activa: true }
        });

        if (!cuenta) {
            throw new Error(`La cuenta con código ${data.codigo_cuenta} no existe o está inactiva`);
        }

        const movimiento = await MovimientoContableModel.create({
            fecha_movimiento: new Date(data.fecha_movimiento),
            codigo_cuenta: data.codigo_cuenta,
            descripcion: data.descripcion || '',
            debe: parseFloat(data.debe) || 0.00,
            haber: parseFloat(data.haber) || 0.00,
            id_venta: data.id_venta || null,
            id_compra: data.id_compra || null,
            id_devolucion: data.id_devolucion || null,
            id_usuario: data.id_usuario || 1
        });

        return movimiento;
    } catch (error) {
        console.error('Error registrarMovimiento:', error);
        throw error;
    }
};