import VarianteProductoModel from '../models/varianteProducto.model.js';
import ProductoModel from '../models/producto.model.js';
import CategoriaModel from '../models/categoria.model.js';
import MarcaModel from '../models/marca.model.js';
import InventarioModel from '../models/inventario.model.js';
import { sequelize } from '../config/db.js';
import { Op } from 'sequelize'; // Para usar operadores

export const getInventarioCompleto = async (req, res) => {
    try {
        // Consultar el modelo VarianteProductoModel, que es nuestro eje de inventario
        const inventarioCompleto = await VarianteProductoModel.findAll({
            // 1. Incluir la información del Producto (nombre, descripción, etc.)
            include: [
                {
                    model: ProductoModel,
                    as: 'producto', // Debe coincidir con el alias en associations.js
                    attributes: ['nombre', 'descripcion', 'activo'],
                    // 2. Anidar las inclusiones para Categoria y Marca (JOINs anidados)
                    include: [
                        {
                            model: CategoriaModel,
                            as: 'categoria', // Alias de Producto -> Categoria
                            attributes: ['nombre'],
                        },
                        {
                            model: MarcaModel,
                            as: 'marca', // Alias de Producto -> Marca
                            attributes: ['nombre'],
                        }
                    ]
                },
                // 3. Incluir el modelo Inventario para traer, por ejemplo, el stock_minimo
                /* Opcional: Si stock_minimo está en la tabla Inventario */
                {
                    model: InventarioModel,
                    as: 'movimientos_inventario', 
                    attributes: ['stock_minimo'],
                    limit: 1, // Si solo quieres la última entrada
                    order: [['created_at', 'DESC']]
                }
            ],
            // Seleccionamos las columnas directamente de VarianteProductoModel
            attributes: [
                'id_variante', 
                'talla', 
                'color', 
                'codigo_barras', 
                'precio_unitario_venta',
                'stock_actual'
            ],
            // Opcional: Ordenar por nombre de producto
            order: [[ProductoModel, 'nombre', 'ASC']]
        });

        // 200 OK: Respuesta exitosa con los datos del inventario
        res.status(200).json(inventarioCompleto);

    } catch (error) {
        console.error('Error al obtener el inventario completo:', error);
        // 500 Internal Server Error: Si algo falla en la conexión o la consulta
        res.status(500).json({ 
            message: 'Error interno del servidor al consultar el inventario.', 
            error: error.message 
        });
    }
};

export const registrarMovimiento = async (req, res) => {
    // 1. Recibir datos necesarios
    const { id_variante, cantidad, tipo, referencia, id_usuario, stock_minimo, fecha_ultima_entrada } = req.body; 
    let t; // Variable para almacenar la transacción

    // Validación básica de campos requeridos
    if (!id_variante || !cantidad || !tipo || !id_usuario) {
        return res.status(400).json({ message: 'Faltan campos requeridos (variante, cantidad, tipo, usuario).' });
    }

    try {
        // Iniciar la transacción para garantizar atomicidad (ambas operaciones deben tener éxito o ninguna)
        t = await sequelize.transaction();

        // 2. Obtener el stock actual de la variante (dentro de la transacción)
        const variante = await VarianteProductoModel.findByPk(id_variante, { transaction: t });

        if (!variante) {
            await t.rollback();
            return res.status(404).json({ message: 'Variante de producto no encontrada.' });
        }
        
        // Calcular el nuevo stock
        let nuevoStock;
        if (tipo === 'entrada') {
            nuevoStock = variante.stock_actual + cantidad;
        } else if (tipo === 'salida' || tipo === 'devolucion' || tipo === 'ajuste') {
            nuevoStock = variante.stock_actual - cantidad;
            // Opcional: Validación para evitar stock negativo en 'salida'
            if (nuevoStock < 0 && tipo === 'salida') {
                await t.rollback();
                return res.status(400).json({ message: 'Stock insuficiente para esta salida.' });
            }
        } else {
            await t.rollback();
            return res.status(400).json({ message: 'Tipo de movimiento inválido.' });
        }

        // 3. Crear el registro en la tabla Inventario (Histórico)
        const movimiento = await InventarioModel.create({
            id_variante,
            tipo,
            cantidad,
            // NOTA: Se necesita lógica para stock_minimo/fecha_ultima_entrada, aquí usamos los valores del body
            stock_minimo: stock_minimo || 0,
            fecha_ultima_entrada: fecha_ultima_entrada || new Date(), 
            referencia,
            id_usuario
        }, { transaction: t });


        // 4. Actualizar el stock_actual en la tabla VarianteProducto
        await variante.update({ stock_actual: nuevoStock }, { transaction: t });

        // Si ambas operaciones (registro y actualización) fueron exitosas, hacer COMMIT
        await t.commit(); 

        res.status(201).json({ 
            message: `Movimiento de ${tipo} registrado y stock actualizado.`,
            nuevoStock,
            movimiento
        });

    } catch (error) {
        // Si hay algún error, hacer ROLLBACK (deshacer todo)
        if (t) await t.rollback();
        console.error('Error en el registro de movimiento de inventario:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor al procesar el movimiento de inventario.', 
            error: error.message 
        });
    }
};

export const ajustarVariante = async (req, res) => {
    const { id_variante } = req.params; // Viene de la URL: /api/inventario/:id_variante
    const { 
        talla, 
        color, 
        precio_unitario_venta, 
        stock_actual, 
        motivo_ajuste, // Nuevo campo para justificar el cambio de stock
        id_usuario
    } = req.body;
    
    let t; // Para la transacción
    
    try {
        t = await sequelize.transaction();
        
        const variante = await VarianteProductoModel.findByPk(id_variante, { transaction: t });
        
        if (!variante) {
            await t.rollback();
            return res.status(404).json({ message: 'Variante de producto no encontrada.' });
        }

        const dataToUpdate = {};
        let stockChange = 0; // Para el registro histórico (InventarioModel)

        // 1. Manejar el cambio de Stock (si se envía)
        if (stock_actual !== undefined && stock_actual !== variante.stock_actual) {
            stockChange = stock_actual - variante.stock_actual; // Diferencia: + para entrada, - para salida
            dataToUpdate.stock_actual = stock_actual;
            
            // 1b. Registrar el movimiento en la tabla Inventario (Histórico)
            await InventarioModel.create({
                id_variante: id_variante,
                tipo: 'ajuste', // Tipo fijo para edición manual de stock
                cantidad: Math.abs(stockChange), // Guardamos el valor absoluto del cambio
                referencia: motivo_ajuste || 'Ajuste manual de inventario', // Motivo es obligatorio para un ajuste
                stock_minimo: 0, // o el que aplique
                fecha_ultima_entrada: new Date(),
                id_usuario: id_usuario // Asegúrate de que este campo venga en el body
            }, { transaction: t });
        }
        
        // 2. Manejar otros cambios (Precio, Talla, Color, etc.)
        if (talla) dataToUpdate.talla = talla;
        if (color) dataToUpdate.color = color;
        if (precio_unitario_venta) dataToUpdate.precio_unitario_venta = precio_unitario_venta;
        
        // 3. Realizar la actualización en VarianteProducto
        if (Object.keys(dataToUpdate).length > 0) {
            await variante.update(dataToUpdate, { transaction: t });
        }

        await t.commit();
        
        res.status(200).json({ 
            message: `Variante ${id_variante} actualizada correctamente.`,
            varianteActualizada: variante 
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error('Error al ajustar la variante de inventario:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor al procesar el ajuste.', 
            error: error.message 
        });
    }
};

export const eliminarVarianteLogicamente = async (req, res) => {
    const { id_variante } = req.params;
    let t;

    try {
        t = await sequelize.transaction();

        const variante = await VarianteProductoModel.findByPk(id_variante, { transaction: t });

        if (!variante) {
            await t.rollback();
            return res.status(404).json({ message: 'Variante de producto no encontrada.' });
        }
        
        // NOTA: Para eliminar una variante, es mejor inactivar el producto padre.
        const producto = await ProductoModel.findByPk(variante.id_producto, { transaction: t });
        
        if (!producto) {
            await t.rollback();
            return res.status(404).json({ message: 'Producto padre no encontrado.' });
        }

        // Marcar el producto como inactivo
        await producto.update({ activo: false }, { transaction: t });

        await t.commit();

        res.status(200).json({ 
            message: `Producto asociado a la variante ${id_variante} marcado como inactivo (eliminación lógica).` 
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error('Error al realizar la eliminación lógica del producto:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor al eliminar la variante.' 
        });
    }
};