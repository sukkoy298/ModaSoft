import CompraModel from '../../models/CompraModel.js';
import DetalleCompraModel from '../../models/DetalleCompraModel.js';
import ProveedorModel from '../../models/ProveedorModel.js';
import VarianteProductoModel from '../../models/VarianteProductoModel.js';
import ProductoModel from '../../models/ProductoModel.js';
import { Op, Sequelize } from 'sequelize';
import { sequelize } from '../../../db.js';

// Importar funciones de inventario
import { actualizarStock } from './inventario.service.js';

export const obtenerTodasLasCompras = async () => {
    try {
        const compras = await CompraModel.findAll({
            include: [
                {
                    model: ProveedorModel,
                    as: 'Proveedor',
                    attributes: ['doc_identidad', 'nombre', 'telefono', 'email']
                },
                {
                    model: DetalleCompraModel,
                    as: 'DetallesCompra',
                    include: [{
                        model: VarianteProductoModel,
                        as: 'VarianteProducto',
                        attributes: ['id_variante', 'talla', 'color', 'codigo_barras', 'precio_unitario_venta'],
                        include: [{
                            model: ProductoModel,
                            as: 'ProductoPrincipal',
                            attributes: ['id_producto', 'nombre']
                        }]
                    }]
                }
            ],
            order: [['fecha', 'DESC'], ['id_compra', 'DESC']]
        });
        return compras;
    } catch (error) {
        console.error("Error al obtener compras:", error);
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
                    attributes: ['doc_identidad', 'nombre', 'telefono', 'email', 'direccion']
                },
                {
                    model: DetalleCompraModel,
                    as: 'Detalles',
                    include: [{
                        model: VarianteProductoModel,
                        as: 'VarianteProducto',
                        include: [{
                            model: ProductoModel,
                            as: 'ProductoPrincipal',
                            attributes: ['id_producto', 'nombre']
                        }]
                    }]
                }
            ]
        });
        
        if (!compra) {
            throw new Error('Compra no encontrada');
        }
        
        return compra;
    } catch (error) {
        console.error("Error al obtener compra:", error);
        throw error;
    }
};

export const registrarCompra = async (data) => {
    const t = await sequelize.transaction();
    
    try {
        // Validaciones básicas
        // Aceptar nro_factura como string o número; considerar vacío como inválido
        if (!data.cedula_proveedor || data.nro_factura === undefined || data.nro_factura === null || String(data.nro_factura).trim() === '' || !data.detalles || !Array.isArray(data.detalles) || data.detalles.length === 0) {
            throw new Error("Datos de compra incompletos. Se requiere proveedor, número de factura y al menos un producto.");
        }

        // Verificar que el proveedor existe
        const proveedor = await ProveedorModel.findByPk(data.cedula_proveedor);
        if (!proveedor) {
            throw new Error(`Proveedor con documento ${data.cedula_proveedor} no encontrado`);
        }

        // Calcular totales
        let subtotal = 0;
        data.detalles.forEach(detalle => {
            const cantidad = Number(detalle.cantidad) || 0;
            const precio = Number(detalle.precio_unitario_costo) || 0;
            if (cantidad <= 0) {
                throw new Error("La cantidad debe ser mayor a 0");
            }
            if (precio <= 0) {
                throw new Error("El precio debe ser mayor a 0");
            }
            subtotal += cantidad * precio;
        });

        const iva = subtotal * 0.16; // 16% IVA
        const total = subtotal + iva;

        // Crear compra
        const nuevaCompra = await CompraModel.create({
            cedula_proveedor: data.cedula_proveedor,
            fecha: data.fecha || new Date(),
            nro_factura: data.nro_factura,
            subtotal: subtotal.toFixed(2),
            iva: iva.toFixed(2),
            total: total.toFixed(2),
            id_usuario: data.id_usuario || 1
        }, { transaction: t });

        // Crear detalles y actualizar inventario
        const detallesPromises = data.detalles.map(async (detalle) => {
            // Verificar que la variante existe
            const variante = await VarianteProductoModel.findByPk(detalle.id_variante);
            if (!variante) {
                throw new Error(`Variante con ID ${detalle.id_variante} no encontrada`);
            }

            // Crear detalle de compra
            const nuevoDetalle = await DetalleCompraModel.create({
                id_compra: nuevaCompra.id_compra,
                id_variante: detalle.id_variante,
                cantidad: detalle.cantidad,
                precio_unitario_costo: detalle.precio_unitario_costo
            }, { transaction: t });

            // Actualizar inventario usando tu función existente
            // Primero necesitamos obtener el código de barras de la variante
            const varianteCompleta = await VarianteProductoModel.findByPk(detalle.id_variante);
            
            await actualizarStock(
                varianteCompleta.codigo_barras,
                detalle.cantidad,
                `compra_${nuevaCompra.id_compra}`,
                data.id_usuario || 1,
                t
            );

            // También actualizar el costo unitario en la variante
            await variante.update({
                costo_unitario: detalle.precio_unitario_costo
            }, { transaction: t });

            return nuevoDetalle;
        });

        await Promise.all(detallesPromises);

        // Registrar movimiento contable
        await registrarMovimientoContable(nuevaCompra, t);

        await t.commit();

        // Obtener compra completa para retornar
        const compraCompleta = await CompraModel.findByPk(nuevaCompra.id_compra, {
            include: [
                {
                    model: ProveedorModel,
                    as: 'Proveedor'
                },
                {
                    model: DetalleCompraModel,
                    as: 'Detalles'
                }
            ]
        });

        return {
            message: 'Compra registrada exitosamente',
            compra: compraCompleta,
            accion: 'creada'
        };

    } catch (error) {
        await t.rollback();
        console.error("Error al registrar compra:", error);
        throw error;
    }
};

// Función para registrar movimiento contable
const registrarMovimientoContable = async (compra, transaction) => {
    try {
        // Aquí deberías usar tu modelo de movimientos contables
        // Esta es una estructura básica de ejemplo:
        console.log(`Movimiento contable registrado para compra ${compra.id_compra}`);
        
        // Ejemplo de registros contables para una compra:
        // 1. DEBE: Inventario por el subtotal
        // 2. DEBE: IVA por el monto de IVA
        // 3. HABER: Proveedores por el total
        
        // await MovimientoContableModel.create([
        //     {
        //         fecha_movimiento: compra.fecha,
        //         codigo_cuenta: '1.1.3', // Inventario
        //         descripcion: `Compra #${compra.id_compra} - Mercancía`,
        //         debe: compra.subtotal,
        //         haber: 0,
        //         id_compra: compra.id_compra,
        //         id_usuario: compra.id_usuario
        //     },
        //     {
        //         fecha_movimiento: compra.fecha,
        //         codigo_cuenta: '2.1.2', // IVA por Pagar
        //         descripcion: `IVA Compra #${compra.id_compra}`,
        //         debe: compra.iva,
        //         haber: 0,
        //         id_compra: compra.id_compra,
        //         id_usuario: compra.id_usuario
        //     },
        //     {
        //         fecha_movimiento: compra.fecha,
        //         codigo_cuenta: '2.1.1', // Proveedores
        //         descripcion: `Compra #${compra.id_compra} - Proveedor`,
        //         debe: 0,
        //         haber: compra.total,
        //         id_compra: compra.id_compra,
        //         id_usuario: compra.id_usuario
        //     }
        // ], { transaction });
        
    } catch (error) {
        console.error("Error al registrar movimiento contable:", error);
        throw error;
    }
};

export const obtenerComprasPorProveedor = async (cedula_proveedor) => {
    try {
        const compras = await CompraModel.findAll({
            where: { cedula_proveedor: cedula_proveedor },
            include: [
                {
                    model: ProveedorModel,
                    as: 'Proveedor'
                }
            ],
            order: [['fecha', 'DESC']]
        });
        return compras;
    } catch (error) {
        console.error("Error al obtener compras por proveedor:", error);
        throw error;
    }
};

export const obtenerComprasPorFecha = async (fechaInicio, fechaFin) => {
    try {
        const whereCondition = {};
        
        if (fechaInicio) {
            whereCondition.fecha = {
                [Op.gte]: fechaInicio
            };
        }
        
        if (fechaFin) {
            whereCondition.fecha = {
                ...whereCondition.fecha,
                [Op.lte]: fechaFin
            };
        }

        const compras = await CompraModel.findAll({
            where: whereCondition,
            include: [
                {
                    model: ProveedorModel,
                    as: 'Proveedor'
                }
            ],
            order: [['fecha', 'DESC']]
        });
        return compras;
    } catch (error) {
        console.error("Error al obtener compras por fecha:", error);
        throw error;
    }
};

export const eliminarCompra = async (id_compra) => {
    const t = await sequelize.transaction();
    
    try {
        // Verificar si existe
        const compraExistente = await CompraModel.findByPk(id_compra);
        
        if (!compraExistente) {
            throw new Error(`Compra con ID ${id_compra} no encontrada`);
        }

        // Obtener detalles para reversar inventario
        const detalles = await DetalleCompraModel.findAll({
            where: { id_compra: id_compra }
        });

        // Reversar inventario
        const reversarPromises = detalles.map(async (detalle) => {
            // Obtener la variante para el código de barras
            const variante = await VarianteProductoModel.findByPk(detalle.id_variante);
            if (variante) {
                // Reversar el stock (cantidad negativa)
                await actualizarStock(
                    variante.codigo_barras,
                    -detalle.cantidad,
                    `reversa_compra_${id_compra}`,
                    1,
                    t
                );
            }
        });

        await Promise.all(reversarPromises);

        // Eliminar detalles
        await DetalleCompraModel.destroy({
            where: { id_compra: id_compra },
            transaction: t
        });

        // Eliminar compra
        const resultado = await CompraModel.destroy({
            where: { id_compra: id_compra },
            transaction: t
        });

        await t.commit();

        return { 
            message: `Compra #${id_compra} eliminada correctamente`,
            tipo: "eliminada",
            detalles_eliminados: detalles.length
        };

    } catch (error) {
        await t.rollback();
        console.error("Error al eliminar compra:", error);
        throw error;
    }
};

export const obtenerComprasHoy = async () => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        const compras = await CompraModel.findAll({
            where: {
                fecha: {
                    [Op.gte]: hoy
                }
            },
            include: [
                {
                    model: ProveedorModel,
                    as: 'Proveedor'
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return compras;
    } catch (error) {
        console.error("Error al obtener compras de hoy:", error);
        throw error;
    }
};

export const obtenerComprasEsteMes = async () => {
    try {
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        
        const finMes = new Date();
        finMes.setMonth(finMes.getMonth() + 1, 0);
        finMes.setHours(23, 59, 59, 999);

        const compras = await CompraModel.findAll({
            where: {
                fecha: {
                    [Op.between]: [inicioMes, finMes]
                }
            },
            include: [
                {
                    model: ProveedorModel,
                    as: 'Proveedor'
                }
            ],
            order: [['fecha', 'DESC']]
        });
        return compras;
    } catch (error) {
        console.error("Error al obtener compras del mes:", error);
        throw error;
    }
};