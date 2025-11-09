import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const MetodoPago = sequelize.define('MetodoPago', {
  id_metodo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_metodo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'metodo_pago', // Asegúrate de que este sea el nombre de tu tabla en la BD
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default MetodoPago;