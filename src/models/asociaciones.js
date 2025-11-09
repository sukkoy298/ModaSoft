// Importa todos tus modelos aquí
import Categoria from './CategoriaModel.js';
import Marca from './MarcaModel.js';
import Producto from './ProductoModel.js';
import Cliente from './ClienteModel.js';
import Usuario from './UsuarioModel.js';
import RolUsuario from './RolUsuarioModel.js';
import MetodoPago from './MetodoPagoModel.js';
import Venta from './VentaModel.js';
import DetalleVenta from './DetalleVentaModel.js';
import Inventario from './InventarioModel.js';
import VarianteProducto from './VarianteProductoModel.js';

export function setupAssociations() {
  // Producto - Categoria
  Producto.belongsTo(Categoria, { foreignKey: 'id_categoria' });
  Categoria.hasMany(Producto, { foreignKey: 'id_categoria' });

  // Producto - Marca
  Producto.belongsTo(Marca, { foreignKey: 'id_marca' });
  Marca.hasMany(Producto, { foreignKey: 'id_marca' });

  // VarianteProducto - Producto
  VarianteProducto.belongsTo(Producto, { foreignKey: 'id_producto' });
  Producto.hasMany(VarianteProducto, { foreignKey: 'id_producto' });

  // Venta - Cliente
  Venta.belongsTo(Cliente, { foreignKey: 'cedula_cliente', targetKey: 'cedula' });
  Cliente.hasMany(Venta, { foreignKey: 'cedula_cliente', sourceKey: 'cedula' });

  // Venta - Usuario
  Venta.belongsTo(Usuario, { foreignKey: 'id_usuario' });
  Usuario.hasMany(Venta, { foreignKey: 'id_usuario' });

  // DetalleVenta - Venta
  DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta' });
  Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta' });

  // DetalleVenta - VarianteProducto
  DetalleVenta.belongsTo(VarianteProducto, { foreignKey: 'id_variante' });
  VarianteProducto.hasMany(DetalleVenta, { foreignKey: 'id_variante' });

  // DetalleVenta - MetodoPago
  DetalleVenta.belongsTo(MetodoPago, { foreignKey: 'id_metodo' });
  MetodoPago.hasMany(DetalleVenta, { foreignKey: 'id_metodo' });

  // Inventario - VarianteProducto
  Inventario.belongsTo(VarianteProducto, { foreignKey: 'id_variante' });
  VarianteProducto.hasMany(Inventario, { foreignKey: 'id_variante' });

  // Inventario - Usuario
  Inventario.belongsTo(Usuario, { foreignKey: 'id_usuario' });
  Usuario.hasMany(Inventario, { foreignKey: 'id_usuario' });

  // Usuario - RolUsuario
  Usuario.belongsTo(RolUsuario, { foreignKey: 'id_rol' });
  RolUsuario.hasMany(Usuario, { foreignKey: 'id_rol' });

  console.log('✅ Asociaciones de modelos configuradas.');
}