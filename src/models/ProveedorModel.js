// models/ProveedorModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const ProveedorModel = sequelize.define('proveedor', {
    cedula: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'proveedor',
    timestamps: false
});

export default ProveedorModel;