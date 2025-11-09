import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const RolUsuario = sequelize.define('RolUsuario', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_rol: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'rol_usuario', // Asegúrate de que este sea el nombre de tu tabla en la BD
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default RolUsuario;