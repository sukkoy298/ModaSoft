import { ProductoModel, VarianteProductoModel } from './models/VarianteProductoModel.js';
import MarcaModel from './models/MarcaModel.js';

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

export const obtenerTodoElInventario = async () => {
    try {

        const variantes = await VarianteProductoModel.findAll({
            include: [
                {
                    model: ProductoModel,
                    as: 'ProductoPrincipal',
                    attributes: ['nombre', 'descripcion'],
                    include: [
                        {
                            model: MarcaModel,
                            as: 'Marca',
                            attributes: ['nombre']
                        },
                        {
                            model: CategoriaModel,
                            as: 'Categoria',
                            attributes: ['nombre']
                        }
                    ]
                }
            ],
            order: [
                [{ model: ProductoModel, as: 'ProductoPrincipal' }, 'nombre', 'ASC'],
                ['talla', 'ASC']
            ]
        });

        const inventarioDetallado = variantes.map(variante => {

            // Usamos desestructuración para un acceso más seguro al Producto Principal
            const prod = variante.ProductoPrincipal;

            // Manejamos las relaciones anidadas
            const marca = prod.Marca ? prod.Marca.nombre : 'N/A';
            const categoria = prod.Categoria ? prod.Categoria.nombre : 'N/A';

            return {
                // Propiedades de la Variante (nivel raíz)
                id_variante: variante.id_variante,
                //Usar el nombre de columna correcto para el SKU
                sku: variante.codigo_barras,
                talla: variante.talla,
                color: variante.color,
                stock_actual: variante.stock_actual,
                //Usar el nombre de columna correcto para el precio
                precio_venta: parseFloat(variante.precio_unitario_venta),
                variante: `${variante.talla} / ${variante.color}`,
                // Propiedades del Producto Principal (Acceso vía el alias 'ProductoPrincipal')
                producto: prod.nombre,
                descripcion: prod.descripcion,

                // Propiedades Anidadas (Marca y Categoría)
                marca: marca,
                categoria: categoria,

                stock_minimo: 10, // Propiedad estática para la tabla
            };
        });

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