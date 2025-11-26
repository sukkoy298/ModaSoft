import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const ProductoModel = sequelize.define('producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_marca: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'producto',
    timestamps: false
});

export default ProductoModel;