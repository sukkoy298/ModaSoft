// src/models/MovimientoContableModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const MovimientoContableModel = sequelize.define('movimiento_contable', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_movimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    codigo_cuenta: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    debe: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00
    },
    haber: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00
    },
    id_venta: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_compra: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_devolucion: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'movimientos_contables',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default MovimientoContableModel;