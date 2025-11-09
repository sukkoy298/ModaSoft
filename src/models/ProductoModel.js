import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: true // O false si siempre debe tener categoría
  },
  id_marca: {
    type: DataTypes.INTEGER,
    allowNull: true // O false si siempre debe tener marca
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
  // No incluimos 'imagen_url' aquí ya que lo quitamos de la consulta SQL
}, {
  tableName: 'producto',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Producto;