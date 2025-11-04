import { ProductoModel, VarianteProductoModel } from './models/VarianteProductoModel.js'; // Ajusta la ruta si es necesario

export const obtenerTodoElInventario = async () => {
    try {
        const variantes = await VarianteProductoModel.findAll({
            include: [
                {
                    model: ProductoModel,
                    attributes: ['nombre', 'id_producto'], 
                    required: true 
                }
            ],
            attributes: [
                ['codigo_barras', 'sku'],
                'talla',
                'color',
                ['precio_unitario_venta', 'precio_venta'],
                'stock_actual',
            ]
        });

        const inventarioDetallado = variantes.map(variante => ({
            sku: variante.dataValues.sku,
            producto: variante.ProductoModel.nombre,
            variante: `${variante.talla} / ${variante.color}`,
            talla: variante.talla,
            color: variante.color,
            stock_actual: variante.stock_actual,
            precio_venta: variante.dataValues.precio_venta,
            
            stock_minimo: 10,
        }));

        return inventarioDetallado;
    } catch (error) {
        console.error("Error al obtener el inventario detallado:", error);
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