import MovimientoContableModel from '../../models/MovimientoContableModel.js';
import { Op } from 'sequelize';

export const obtenerMovimientos = async (fecha_inicio, fecha_fin) => {
  try {
    const where = {};
    if (fecha_inicio && fecha_fin) {
      const inicio = new Date(fecha_inicio);
      const fin = new Date(fecha_fin);
      fin.setHours(23,59,59,999);
      where.fecha_movimiento = { [Op.between]: [inicio, fin] };
    }

    const movimientos = await MovimientoContableModel.findAll({ where, order: [['fecha_movimiento', 'DESC']] });
    return movimientos;
  } catch (error) {
    console.error('Error obtenerMovimientos:', error);
    throw error;
  }
};

export const registrarMovimiento = async (data) => {
  try {
    if (!data.fecha_movimiento || !data.codigo_cuenta || (!data.debe && !data.haber)) {
      throw new Error('fecha_movimiento, codigo_cuenta y (debe o haber) son requeridos');
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
