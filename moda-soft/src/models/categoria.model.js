import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const CategoriaModel = sequelize.define('categoria', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'categoria',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default CategoriaModel;