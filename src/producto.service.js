// src/producto.service.js

// 1. Importar los modelos. Asumimos que los has definido como se sugirió:
import { ProductoModel, VarianteProductoModel } from './models/VarianteProductoModel.js'; // Ajusta la ruta si es necesario

/**
 * Obtiene una lista detallada de todas las variantes de producto (Inventario).
 * Incluye el nombre del producto principal para cada variante.
 * @returns {Promise<Array>} Lista de variantes con detalles de producto.
 */
export const obtenerTodoElInventario = async () => {
    try {
        // Usamos findByAll en VarianteProductoModel e incluimos ProductoModel
        const variantes = await VarianteProductoModel.findAll({
            // Incluimos el modelo ProductoModel para hacer el JOIN
            include: [
                {
                    model: ProductoModel,
                    // Seleccionamos solo el nombre del producto de la tabla 'producto'
                    attributes: ['nombre', 'id_producto'], 
                    // Esto asegura que solo se obtienen productos que tienen variantes
                    required: true 
                }
            ],
            // Seleccionamos los atributos específicos que necesitamos del inventario (variante)
            attributes: [
                ['codigo_barras', 'sku'], // Renombrar 'codigo_barras' a 'sku' para el frontend
                'talla',
                'color',
                ['precio_unitario_venta', 'precio_venta'], // Renombrar el precio
                'stock_actual',
                // El stock mínimo no está en variante_producto en tu SQL,
                // pero lo incluiremos aquí (por ejemplo, asumiendo una columna extra en la tabla variante_producto,
                // o lo manejamos en el frontend/otro modelo)
                // Por ahora, usaremos un valor constante o un campo si lo añades:
                // 'stock_minimo' 
                
                // Nota: Tu tabla SQL de 'variante_producto' no tiene 'stock_minimo'.
                // Por el momento, la vista del frontend tendrá que usar un valor por defecto o 
                // esperar a que implementes la columna 'stock_minimo' en la tabla 'variante_producto'.
            ]
        });

        // Mapeamos el resultado para limpiar y simplificar el objeto para el frontend,
        // y para incluir el nombre del producto directamente.
        const inventarioDetallado = variantes.map(variante => ({
            sku: variante.dataValues.sku,
            producto: variante.ProductoModel.nombre, // Accedemos al nombre del producto
            variante: `${variante.talla} / ${variante.color}`, // Combinamos talla y color
            talla: variante.talla,
            color: variante.color,
            stock_actual: variante.stock_actual,
            precio_venta: variante.dataValues.precio_venta,
            
            // Asumiendo un stock mínimo por defecto si no existe la columna en DB
            stock_minimo: 10, // **AJUSTAR**: Colocar aquí el valor real de la DB si se añade.
        }));

        return inventarioDetallado;
    } catch (error) {
        console.error("Error al obtener el inventario detallado:", error);
        // Propagamos el error para que el controlador lo maneje
        throw new Error("No se pudo obtener la lista de inventario."); 
    }
};

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