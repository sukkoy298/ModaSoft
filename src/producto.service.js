import { ProductoModel, VarianteProductoModel } from './models/VarianteProductoModel.js';
import MarcaModel from './models/MarcaModel.js';
import { sequelize } from '../db.js'
import { QueryTypes } from 'sequelize'

export const actualizarStockVariante = async (codigoBarras, cantidad) => {
    try {
        const variante = await VarianteProductoModel.findOne({
            where: { codigo_barras: codigoBarras }
        });

        if (!variante) {
            throw new Error(`Variante con código de barras ${codigoBarras} no encontrada.`);
        }

        const nuevoStock = variante.stock_actual + cantidad;

        if (nuevoStock < 0) {
            throw new Error(`Operación inválida: El stock para código de barras ${codigoBarras} no puede ser negativo. Stock actual: ${variante.stock_actual}`);
        }

        variante.stock_actual = nuevoStock;
        await variante.save();

        return variante;
    } catch (error) {
        console.error("Error en servicio al modificar stock de variante:", error);
        throw error;
    }
};

export async function obtenerTodoElInventario() {
  // Ajustado para que el 'id' principal sea el de la variante, que es único.
  const sql = `
    SELECT
        v.id_variante AS id,                      -- <-- CAMBIO: El ID principal ahora es el de la variante
        p.id_producto AS id_producto,             -- <-- CAMBIO: El ID del producto se mantiene con su nombre original
        p.nombre AS producto,
        COALESCE(p.descripcion, '') AS descripcion,
        v.codigo_barras AS sku,
        v.talla AS talla,
        v.color AS color,
        COALESCE(v.precio_unitario_venta, 0) AS precio,
        COALESCE(inv.stock_actual, 0) AS stock_actual,
        p.id_categoria AS id_categoria,
        p.id_marca AS id_marca
    FROM producto p
    INNER JOIN variante_producto v ON v.id_producto = p.id_producto
    LEFT JOIN (
        SELECT
            i1.id_variante,
            i1.stock_actual
        FROM inventario i1
        WHERE i1.id_inventario = (
            SELECT MAX(i2.id_inventario)
            FROM inventario i2
            WHERE i2.id_variante = i1.id_variante
        )
    ) AS inv ON inv.id_variante = v.id_variante
    WHERE p.activo = 1
    ORDER BY p.id_producto, v.id_variante;
  `;

  try {
    const rows = await sequelize.query(sql, { type: QueryTypes.SELECT });
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    console.error('producto.service.obtenerTodoElInventario ERROR:', err.message);
    console.error('SQL Error Details:', err.original);
    throw new Error('No se pudo obtener la lista de inventario desde la base de datos.');
  }
}

import CategoriaModel from './models/CategoriaModel.js';

export const obtenerTodasLasCategorias = async () => {
    try {
        const categorias = await CategoriaModel.findAll({
            attributes: ['id_categoria', 'nombre'],
            order: [['nombre', 'ASC']]
        });
        return categorias;
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        throw new Error("No se pudo obtener la lista de categorías.");
    }
};

export const registrarProducto = async (data) => {
    try {
        if (!data.nombre || !data.id_categoria || !data.id_marca) {
            throw new Error("Nombre, Categoría y Marca son obligatorios para registrar un producto.");
        }

        const nuevoProducto = await ProductoModel.create(data);
        return nuevoProducto;
    } catch (error) {
        console.error("Error al registrar producto principal:", error);
        throw error;
    }
};

export const registrarVarianteProducto = async (data) => {
    try {
        if (!data.id_producto || !data.sku || data.precio_venta <= 0) {
            throw new Error("El ID del Producto, SKU y Precio de Venta son obligatorios.");
        }

        // Mapeo de campos del frontend a los de la base de datos (si son diferentes)
        const varianteData = {
            id_producto: data.id_producto,
            codigo_barras: data.sku, // El SKU en el frontend se mapea a codigo_barras en el backend
            talla: data.talla,
            color: data.color,
            stock_actual: data.stock_actual || 0,
            precio_unitario_venta: data.precio_venta
        };

        const nuevaVariante = await VarianteProductoModel.create(varianteData);
        return nuevaVariante;

    } catch (error) {
        console.error("Error al registrar variante de producto:", error);
        // Manejo de error de SKU duplicado
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`El SKU '${data.sku}' ya existe para otra variante.`);
        }
        throw error;
    }
};

export const obtenerProductosPrincipales = async () => {
    try {
        const productos = await ProductoModel.findAll({
            // Incluimos solo las columnas que necesitamos para el select
            attributes: ['id_producto', 'nombre'],
            // Incluimos la marca
            include: [
                {
                    model: MarcaModel,
                    as: 'Marca',
                    attributes: ['nombre'],
                    required: false
                }
            ],
            order: [['nombre', 'ASC']]
        });
        return productos;
    } catch (error) {
        console.error("Error al obtener la lista de productos principales:", error);
        throw new Error("No se pudo obtener la lista de productos principales.");
    }
};