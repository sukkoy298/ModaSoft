import VarianteProductoModel from './VarianteProductoModel.js';
import ProductoModel from './ProductoModel.js';
import MarcaModel from './MarcaModel.js';
import CategoriaModel from './CategoriaModel.js';
import VentaModel from './VentaModel.js';
import DetalleVentaModel from './DetalleVentaModel.js';
import ClienteModel from './ClienteModel.js';
import UsuariosModel from './UsuarioModel.js';
import RolUsuarioModel from './RolUsuarioModel.js';
import InventarioModel from './InventarioModel.js';
import CompraModel from './CompraModel.js';
import DevolucionModel from './DevolucionModel.js';
import ProveedorModel from './ProveedorModel.js';
import DetalleCompraModel from './DetalleCompraModel.js';
import DetalleDevolucionModel from './DetalleDevolucionModel.js';
import MovimientoContableModel from './MovimientoContableModel.js';

// 1. Producto (id_marca) <--> Marca
ProductoModel.belongsTo(MarcaModel, {
    foreignKey: 'id_marca', 
    as: 'Marca'
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
    as: 'ProductoPrincipal'
});
ProductoModel.hasMany(VarianteProductoModel, {
    foreignKey: 'id_producto',
    as: 'Variantes'
});

// 4. Venta (Cabecera) <--> Cliente
VentaModel.belongsTo(ClienteModel, {
    foreignKey: 'cedula_cliente',
    targetKey: 'cedula',
    as: 'Cliente'
});
ClienteModel.hasMany(VentaModel, {
    foreignKey: 'cedula_cliente',
    sourceKey: 'cedula',
    as: 'Ventas'
});

// 5. Venta (Cabecera) <--> DetalleVenta (Items)
VentaModel.hasMany(DetalleVentaModel, {
    foreignKey: 'id_venta',
    as: 'DetallesVenta' // Cambiado de 'Detalles' para evitar conflicto
});
DetalleVentaModel.belongsTo(VentaModel, {
    foreignKey: 'id_venta',
    as: 'Venta'
});

// 6. DetalleVenta <--> VarianteProducto
DetalleVentaModel.belongsTo(VarianteProductoModel, {
    foreignKey: 'id_variante',
    as: 'VarianteProducto'
});
VarianteProductoModel.hasMany(DetalleVentaModel, {
    foreignKey: 'id_variante',
    as: 'DetallesVenta'
});

// 7. Usuario <--> RolUsuario
UsuariosModel.belongsTo(RolUsuarioModel, {
    foreignKey: 'id_rol',
    as: 'Rol'
});
RolUsuarioModel.hasMany(UsuariosModel, {
    foreignKey: 'id_rol',
    as: 'Usuarios'
});

// 8. Inventario <--> Usuario
InventarioModel.belongsTo(UsuariosModel, {
    foreignKey: 'id_usuario',
    as: 'Usuario'
});
UsuariosModel.hasMany(InventarioModel, {
    foreignKey: 'id_usuario',
    as: 'Inventarios'
});

// 9. Inventario <--> VarianteProducto  
InventarioModel.belongsTo(VarianteProductoModel, {
    foreignKey: 'id_variante',
    as: 'Variante'
});
VarianteProductoModel.hasOne(InventarioModel, {
    foreignKey: 'id_variante',
    as: 'Inventario'
});

// 10. Compra <--> Proveedor
CompraModel.belongsTo(ProveedorModel, {
    foreignKey: 'cedula_proveedor',
    targetKey: 'doc_identidad',
    as: 'Proveedor'
});
ProveedorModel.hasMany(CompraModel, {
    foreignKey: 'cedula_proveedor',
    sourceKey: 'doc_identidad',
    as: 'Compras'
});

// 11. Compra <--> DetalleCompra
CompraModel.hasMany(DetalleCompraModel, {
    foreignKey: 'id_compra',
    as: 'DetallesCompra' // Cambiado de 'Detalles' para evitar conflicto
});
DetalleCompraModel.belongsTo(CompraModel, {
    foreignKey: 'id_compra',
    as: 'Compra'
});

// 12. DetalleCompra <--> VarianteProducto
DetalleCompraModel.belongsTo(VarianteProductoModel, {
    foreignKey: 'id_variante',
    as: 'VarianteProducto' // Cambiado de 'Variante' para consistencia
});
VarianteProductoModel.hasMany(DetalleCompraModel, {
    foreignKey: 'id_variante',
    as: 'DetallesCompra'
});

// 13. Devolucion <--> Venta
DevolucionModel.belongsTo(VentaModel, {
    foreignKey: 'id_venta',
    as: 'Venta'
});
VentaModel.hasMany(DevolucionModel, {
    foreignKey: 'id_venta',
    as: 'Devoluciones'
});

// 14. Devolucion <--> DetalleDevolucion
DevolucionModel.hasMany(DetalleDevolucionModel, {
    foreignKey: 'id_devolucion',
    as: 'DetallesDevolucion' // Cambiado de 'Detalles' para evitar conflicto
});
DetalleDevolucionModel.belongsTo(DevolucionModel, {
    foreignKey: 'id_devolucion',
    as: 'Devolucion'
});

// 15. DetalleDevolucion <--> VarianteProducto
DetalleDevolucionModel.belongsTo(VarianteProductoModel, {
    foreignKey: 'id_variante',
    as: 'VarianteProducto'
});
VarianteProductoModel.hasMany(DetalleDevolucionModel, {
    foreignKey: 'id_variante',
    as: 'DetallesDevolucion'
});

// 16. Movimientos Contables
MovimientoContableModel.belongsTo(VentaModel, {
    foreignKey: 'id_venta',
    as: 'Venta'
});
MovimientoContableModel.belongsTo(CompraModel, {
    foreignKey: 'id_compra',
    as: 'Compra'
});
MovimientoContableModel.belongsTo(DevolucionModel, {
    foreignKey: 'id_devolucion',
    as: 'Devolucion'
});
MovimientoContableModel.belongsTo(UsuariosModel, {
    foreignKey: 'id_usuario',
    as: 'Usuario'
});

VentaModel.hasMany(MovimientoContableModel, {
    foreignKey: 'id_venta',
    as: 'MovimientosContables'
});
CompraModel.hasMany(MovimientoContableModel, {
    foreignKey: 'id_compra',
    as: 'MovimientosContables'
});

// Función de inicialización
export const setupAssociations = async () => {
    try {
        // Validar que todos los modelos estén definidos
        const modelos = [
            VarianteProductoModel, ProductoModel, MarcaModel, CategoriaModel,
            VentaModel, DetalleVentaModel, ClienteModel, UsuariosModel,
            RolUsuarioModel, InventarioModel, CompraModel, DevolucionModel,
            ProveedorModel, DetalleCompraModel, DetalleDevolucionModel,
            MovimientoContableModel
        ];
        
        for (const modelo of modelos) {
            if (!modelo || typeof modelo !== 'function') {
                console.error(`❌ Modelo no definido: ${modelo?.name || 'Desconocido'}`);
            }
        }
        
        console.log("✅ Asociaciones de Sequelize cargadas correctamente.");
    } catch (error) {
        console.error("❌ Error al cargar asociaciones:", error);
    }
};