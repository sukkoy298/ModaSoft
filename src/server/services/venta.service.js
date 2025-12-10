import { sequelize } from '../../../db.js' // <-- ruta correcta hacia db.js en la raíz del proyecto
import { Sequelize } from 'sequelize'
import Venta from '../../models/VentaModel.js'
import DetalleVenta from '../../models/DetalleVentaModel.js'
import VarianteProducto from '../../models/VarianteProductoModel.js'
import Inventario from '../../models/InventarioModel.js'
import MetodoPago from '../../models/MetodoPagoModel.js'
import Cliente from '../../models/ClienteModel.js'
import Usuario from '../../models/UsuarioModel.js'
import MovimientoContableModel from '../../models/MovimientoContableModel.js'

const IVA_RATE = 0.16 // ajusta si corresponde

export async function registrarVenta(payload) {
  const t = await sequelize.transaction()
  try {
    // payload esperado:
    // { cedula_cliente, id_usuario, estado?, detalles: [{ id_variante, id_metodo, cantidad, precio_unitario_venta }] }
    if (!Array.isArray(payload.detalles) || payload.detalles.length === 0) {
      throw new Error('La venta debe contener al menos un detalle.')
    }

    // calcular subtotal
    const subtotal = payload.detalles.reduce((s, d) => {
      const price = Number(d.precio_unitario_venta ?? 0)
      const qty = Number(d.cantidad ?? 0)
      return s + price * qty
    }, 0)

    const iva = Number((subtotal * IVA_RATE).toFixed(2))
    const total = Number((subtotal + iva).toFixed(2))

    // Crear registro en tabla venta
    const venta = await Venta.create({
      cedula_cliente: payload.cedula_cliente || '23948576', // cliente genérico si no viene
      fecha: payload.fecha ? payload.fecha : new Date(),
      total,
      estado: payload.estado || 'pagada',
      id_usuario: payload.id_usuario || 1,
      subtotal,
      iva
    }, { transaction: t })

    // Procesar cada detalle: validar variante, stock, insertar detalle_venta y registrar movimiento en inventario
    for (const d of payload.detalles) {
      const id_variante = Number(d.id_variante)
      const cantidad = Number(d.cantidad)
      const precio_unitario_venta = Number(d.precio_unitario_venta)

      if (!id_variante || cantidad <= 0) {
        throw new Error('Detalle de venta inválido (id_variante o cantidad).')
      }

      // verificar variante existe
      const variante = await VarianteProducto.findByPk(id_variante, { transaction: t, lock: t.LOCK.SHARE })
      if (!variante) {
        throw new Error(`Variante no encontrada: ${id_variante}`)
      }

      // obtener última fila de inventario para esa variante (lock para evitar condiciones de carrera)
      const invRow = await Inventario.findOne({
        where: { id_variante },
        order: [['id_inventario', 'DESC']],
        transaction: t,
        lock: t.LOCK.UPDATE
      })

      const stockActual = invRow ? Number(invRow.stock_actual) : 0
      if (stockActual < cantidad) {
        throw new Error(`Stock insuficiente para la variante ${id_variante}. Disponible: ${stockActual}`)
      }

      // crear nuevo registro de inventario tipo 'salida' (mantener historial)
      const nuevoStock = stockActual - cantidad
      await Inventario.create({
        id_variante,
        tipo: 'salida',
        cantidad,
        stock_actual: nuevoStock,
        stock_minimo: invRow ? invRow.stock_minimo : 0,
        fecha_ultima_entrada: new Date(),
        referencia: `venta_${venta.id_venta}`,
        id_usuario: payload.id_usuario || 1
      }, { transaction: t })

      // crear detalle_venta (id_metodo debe corresponder a metodo_pago.id_metodopago)
      await DetalleVenta.create({
        id_venta: venta.id_venta,
        id_variante,
        id_metodo: d.id_metodo || null,
        cantidad,
        precio_unitario_venta
      }, { transaction: t })
    }

    // Registrar movimientos contables relacionados con la venta
    // 1) DEBE: Caja (total)
    // 2) HABER: Ventas (subtotal)
    // 3) HABER: IVA por pagar (iva)
    // 4) DEBE: Costo de ventas (costo_total)
    // 5) HABER: Inventario (costo_total)
    try {
      // calcular costo total aproximado consultando las variantes (costo_unitario)
      let costo_total = 0
      for (const d of payload.detalles) {
        const v = await VarianteProducto.findByPk(Number(d.id_variante), { transaction: t })
        const costoUnit = v ? Number(v.costo_unitario || 0) : 0
        costo_total += costoUnit * Number(d.cantidad || 0)
      }

      const movimientosContables = []

      // Caja (DEBE)
      movimientosContables.push({
        fecha_movimiento: venta.fecha,
        codigo_cuenta: '1.1.1',
        descripcion: `Venta #${venta.id_venta} - Cobro`,
        debe: total,
        haber: 0,
        id_venta: venta.id_venta,
        id_usuario: venta.id_usuario || payload.id_usuario || 1
      })

      // Ventas (HABER)
      movimientosContables.push({
        fecha_movimiento: venta.fecha,
        codigo_cuenta: '4.1.1',
        descripcion: `Ingreso por venta #${venta.id_venta}`,
        debe: 0,
        haber: subtotal,
        id_venta: venta.id_venta,
        id_usuario: venta.id_usuario || payload.id_usuario || 1
      })

      // IVA por pagar (HABER)
      if (iva > 0) {
        movimientosContables.push({
          fecha_movimiento: venta.fecha,
          codigo_cuenta: '2.1.2',
          descripcion: `IVA venta #${venta.id_venta}`,
          debe: 0,
          haber: iva,
          id_venta: venta.id_venta,
          id_usuario: venta.id_usuario || payload.id_usuario || 1
        })
      }

      // Costo de ventas (DEBE) y ajuste de Inventario (HABER)
      if (costo_total > 0) {
        movimientosContables.push({
          fecha_movimiento: venta.fecha,
          codigo_cuenta: '5.1.1',
          descripcion: `Costo venta #${venta.id_venta}`,
          debe: costo_total,
          haber: 0,
          id_venta: venta.id_venta,
          id_usuario: venta.id_usuario || payload.id_usuario || 1
        })

        movimientosContables.push({
          fecha_movimiento: venta.fecha,
          codigo_cuenta: '1.1.3',
          descripcion: `Salida inventario venta #${venta.id_venta}`,
          debe: 0,
          haber: costo_total,
          id_venta: venta.id_venta,
          id_usuario: venta.id_usuario || payload.id_usuario || 1
        })
      }

      if (movimientosContables.length) {
        await MovimientoContableModel.bulkCreate(movimientosContables, { transaction: t })
      }
    } catch (errMov) {
      // Si falla registrar movimientos contables, hacemos rollback y lanzamos
      console.error('Error registrando movimientos contables de venta:', errMov)
      throw errMov
    }

    await t.commit()
    return { id_venta: venta.id_venta, subtotal, iva, total }
  } catch (err) {
    await t.rollback()
    // normalizar mensajes de error
    if (err instanceof Sequelize.ForeignKeyConstraintError) {
      throw new Error('Error de integridad referencial: ' + (err.message || ''))
    }
    throw err
  }
}

export async function obtenerHistorialVentas(fechaInicio = null, fechaFin = null) {
  const where = {}
  if (fechaInicio && fechaFin) {
    where.fecha = { [Sequelize.Op.between]: [fechaInicio, fechaFin] }
  } else if (fechaInicio) {
    where.fecha = fechaInicio
  }

  return Venta.findAll({
    where,
    include: [
      { model: Cliente, as: 'Cliente', attributes: ['cedula', 'nombre'] },
      { model: Usuario, as: 'Usuario', attributes: ['usuario'] }
    ],
    order: [['fecha', 'DESC'], ['id_venta', 'DESC']]
  })
}

export async function obtenerVentaPorId(idVenta) {
  return Venta.findByPk(idVenta, {
    include: [
      { model: Cliente, as: 'Cliente', attributes: ['cedula', 'nombre', 'telefono', 'email', 'direccion'] },
      { model: Usuario, as: 'Usuario', attributes: ['usuario'] },
      {
        model: DetalleVenta,
        include: [
          { model: VarianteProducto, as: 'VarianteProducto' },
          { model: MetodoPago, as: 'MetodoPago' }
        ]
      }
    ]
  })
}

export async function obtenerDetalleVenta(idVenta) {
  return DetalleVenta.findAll({
    where: { id_venta: idVenta },
    include: [
      { model: VarianteProducto, as: 'VarianteProducto' },
      { model: MetodoPago, as: 'MetodoPago' }
    ]
  })
}

export async function anularVenta(idVenta) {
  const t = await sequelize.transaction()
  try {
    const venta = await Venta.findByPk(idVenta, { transaction: t })
    if (!venta) throw new Error('Venta no encontrada')

    // si ya está anulada
    if (venta.estado === 'anulada') {
      await t.commit()
      return venta
    }

    // obtener detalles para devolver stock
    const detalles = await DetalleVenta.findAll({ where: { id_venta: idVenta }, transaction: t, lock: t.LOCK.UPDATE })

    // revertir inventario creando movimientos de tipo 'entrada'
    for (const det of detalles) {
      const invRow = await Inventario.findOne({
        where: { id_variante: det.id_variante },
        order: [['id_inventario', 'DESC']],
        transaction: t,
        lock: t.LOCK.UPDATE
      })

      const stockActual = invRow ? Number(invRow.stock_actual) : 0
      const nuevoStock = stockActual + det.cantidad

      await Inventario.create({
        id_variante: det.id_variante,
        tipo: 'entrada',
        cantidad: det.cantidad,
        stock_actual: nuevoStock,
        stock_minimo: invRow ? invRow.stock_minimo : 0,
        fecha_ultima_entrada: new Date(),
        referencia: `anulacion_venta_${idVenta}`,
        id_usuario: venta.id_usuario || 1
      }, { transaction: t })
    }

    venta.estado = 'anulada'
    await venta.save({ transaction: t })

    await t.commit()
    return venta
  } catch (err) {
    await t.rollback()
    throw err
  }
}

export default {
  registrarVenta,
  obtenerHistorialVentas,
  obtenerVentaPorId,
  obtenerDetalleVenta,
  anularVenta
}