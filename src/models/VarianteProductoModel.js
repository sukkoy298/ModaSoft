import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const VarianteProducto = sequelize.define('VarianteProducto', {
  id_variante: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  talla: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  codigo_barras: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  precio_unitario_venta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'variante_producto',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default VarianteProducto;