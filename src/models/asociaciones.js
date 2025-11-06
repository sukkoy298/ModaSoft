import { ProductoModel, VarianteProductoModel } from './VarianteProductoModel.js';
import MarcaModel from './MarcaModel.js';
import CategoriaModel from './CategoriaModel.js';
import VentaModel from './VentaModel.js';
import DetalleVentaModel from './DetalleVentaModel.js';
import ClienteModel from './ClienteModel.js';

// 1. Producto (id_marca) <--> Marca
ProductoModel.belongsTo(MarcaModel, {
    foreignKey: 'id_marca', 
    as: 'Marca' // Alias usado en el frontend: p.Marca.nombre
});
MarcaModel.hasMany(ProductoModel, {
    foreignKey: 'id_marca',
    as: 'Productos'
});

// 2. Producto (id_categoria) <--> Categoria
ProductoModel.belongsTo(CategoriaModel, {
    foreignKey: 'id_categoria',
    as: 'Categoria'
});
CategoriaModel.hasMany(ProductoModel, {
    foreignKey: 'id_categoria',
    as: 'Productos'
});


// 3. VarianteProducto (id_producto) <--> Producto
VarianteProductoModel.belongsTo(ProductoModel, {
    foreignKey: 'id_producto',
    as: 'ProductoPrincipal' // Nombre que usaste en obtenerTodoElInventario
});
ProductoModel.hasMany(VarianteProductoModel, {
    foreignKey: 'id_producto',
    as: 'Variantes'
});

export const setupAssociations = () => {
    console.log("✅ Asociaciones de Sequelize cargadas.");
    // Esto asegura que el archivo se ejecute
};

// Venta (Cabecera) <--> Cliente
VentaModel.belongsTo(ClienteModel, {
    foreignKey: 'id_cliente',
    as: 'Cliente'
});

// Venta (Cabecera) <--> DetalleVenta (Items)
VentaModel.hasMany(DetalleVentaModel, {
    foreignKey: 'id_venta',
    as: 'Detalles'
});
DetalleVentaModel.belongsTo(VentaModel, {
    foreignKey: 'id_venta',
    as: 'VentaPrincipal'
});

// DetalleVenta <--> VarianteProducto
DetalleVentaModel.belongsTo(VarianteProductoModel, {
    foreignKey: 'id_variante',
    as: 'VarianteProducto' // Para saber qué producto se vendió
});