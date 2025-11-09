// models/VentaModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const Venta = sequelize.define('Venta', {
  id_venta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cedula_cliente: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: 'pagada'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'venta',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Venta;