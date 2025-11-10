import CategoriaModel from './categoria.model.js';
import MarcaModel from './marca.model.js';
import ProductoModel from './producto.model.js';
import VarianteProductoModel from './varianteProducto.model.js';
import InventarioModel from './inventario.model.js';
import UsuarioModel from './usuario.model.js'; 
import RolUsuarioModel from './rolUsuario.model.js'; 
import ProveedorModel from './proveedor.model.js';
import CompraModel from './compra.model.js';
import DetalleCompraModel from './detalleCompra.model.js';


export const setupAssociations = () => {
    // --- 1. Módulo Producto/Inventario (El Eje Central) ---
    
    // Producto (1) <-> Categoria (N)
    ProductoModel.belongsTo(CategoriaModel, { foreignKey: 'id_categoria', as: 'categoria' });
    CategoriaModel.hasMany(ProductoModel, { foreignKey: 'id_categoria', as: 'productos' });

    // Producto (1) <-> Marca (N)
    ProductoModel.belongsTo(MarcaModel, { foreignKey: 'id_marca', as: 'marca' });
    MarcaModel.hasMany(ProductoModel, { foreignKey: 'id_marca', as: 'productos' });

    // VarianteProducto (N) <-> Producto (1)
    VarianteProductoModel.belongsTo(ProductoModel, { foreignKey: 'id_producto', as: 'producto' });
    ProductoModel.hasMany(VarianteProductoModel, { foreignKey: 'id_producto', as: 'variantes' });

    // Inventario (N) <-> VarianteProducto (1)
    InventarioModel.belongsTo(VarianteProductoModel, { foreignKey: 'id_variante', as: 'variante' });
    VarianteProductoModel.hasMany(InventarioModel, { foreignKey: 'id_variante', as: 'movimientos_inventario' });


    // --- 2. Módulo de Compras ---

    // Compra (1) <-> Proveedor (N)
    CompraModel.belongsTo(ProveedorModel, { foreignKey: 'id_proveedor', as: 'proveedor' });
    ProveedorModel.hasMany(CompraModel, { foreignKey: 'id_proveedor', as: 'compras' });

    // DetalleCompra (N) <-> Compra (1)
    DetalleCompraModel.belongsTo(CompraModel, { foreignKey: 'id_compra', as: 'compra' });
    CompraModel.hasMany(DetalleCompraModel, { foreignKey: 'id_compra', as: 'detalles' });
    
    // DetalleCompra (N) <-> VarianteProducto (1)
    DetalleCompraModel.belongsTo(VarianteProductoModel, { foreignKey: 'id_variante', as: 'variante' });
    // VarianteProductoModel.hasMany(DetalleCompraModel, { foreignKey: 'id_variante', as: 'detalles_compra' }); // Inversa opcional
    
    // --- 5. Módulo de Usuarios/Auditoría (Transacciones) ---

    // Usuarios (N) <-> RolUsuario (1)
    UsuarioModel.belongsTo(RolUsuarioModel, { foreignKey: 'id_rol', as: 'rol' });
    RolUsuarioModel.hasMany(UsuarioModel, { foreignKey: 'id_rol', as: 'usuarios' });

    // Todas las transacciones tienen un usuario
    const transactions = [CompraModel, InventarioModel];
    
    transactions.forEach(Model => {
        Model.belongsTo(UsuarioModel, { foreignKey: 'id_usuario', as: 'usuario_registro' });
        UsuarioModel.hasMany(Model, { foreignKey: 'id_usuario', as: Model.tableName + 's' }); // ej: usuario.compras, usuario.ventas
    });
};