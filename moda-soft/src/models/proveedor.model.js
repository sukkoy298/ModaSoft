import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ProveedorModel = sequelize.define('proveedor', {
    doc_identidad: {
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
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'proveedor',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default ProveedorModel;