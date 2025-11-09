import { sequelize } from '../db.js';
import Venta from './models/VentaModel.js';
import DetalleVenta from './models/DetalleVentaModel.js';
import Inventario from './models/InventarioModel.js';
import VarianteProducto from './models/VarianteProductoModel.js'; // Para verificar la variante

export async function registrarVenta(ventaData) {
  const transaction = await sequelize.transaction();
  try {
    const { cliente, lines, total, fecha } = ventaData;

    // Valores por defecto para datos que no vienen del frontend (ajusta según tu lógica)
    const id_usuario = 1; // ID de un usuario por defecto (ej. el vendedor logueado)
    const id_metodo = 1;  // ID de un método de pago por defecto (ej. 'Efectivo')
    const estado = 'pagada'; // Estado inicial de la venta

    // 1. Crear la Venta principal
    const nuevaVenta = await Venta.create({
      cedula_cliente: cliente?.cedula || '23948576', // Usa la cédula del cliente o una cédula genérica (debe existir en tu tabla cliente)
      fecha: fecha || new Date(),
      total: total,
      estado: estado,
      id_usuario: id_usuario
    }, { transaction });

    // 2. Crear los Detalles de Venta y actualizar el Inventario para cada línea
    for (const line of lines) {
      await DetalleVenta.create({
        id_venta: nuevaVenta.id_venta,
        id_variante: line.id_variante,
        id_metodo: id_metodo,
        cantidad: line.qty,
        precio_unitario_venta: line.price
      }, { transaction });

      // Actualizar stock en inventario
      // Primero, obtenemos el último registro de inventario para la variante
      const ultimoInventario = await Inventario.findOne({
        where: { id_variante: line.id_variante },
        order: [['id_inventario', 'DESC']],
        transaction
      });

      let stockActual = ultimoInventario ? ultimoInventario.stock_actual : 0;
      const stockMinimo = ultimoInventario ? ultimoInventario.stock_minimo : 0;

      if (stockActual < line.qty) {
        throw new Error(`Stock insuficiente para la variante ${line.id_variante}. Disponible: ${stockActual}, Solicitado: ${line.qty}`);
      }
      stockActual -= line.qty;

      // Registrar la salida en la tabla de inventario
      await Inventario.create({
        id_variante: line.id_variante,
        tipo: 'salida',
        cantidad: line.qty,
        stock_actual: stockActual,
        stock_minimo: stockMinimo,
        fecha_ultima_entrada: new Date(), // Fecha de la salida
        referencia: `Venta #${nuevaVenta.id_venta}`,
        id_usuario: id_usuario
      }, { transaction });
    }

    await transaction.commit();
    return nuevaVenta;

  } catch (error) {
    await transaction.rollback();
    console.error('Error en registrarVenta:', error.message);
    throw error;
  }
}