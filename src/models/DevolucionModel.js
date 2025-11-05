// models/DevolucionModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const DevolucionModel = sequelize.define('devolucion', {
    id_devolucion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_venta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    motivo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'devolucion',
    timestamps: false
});

export default DevolucionModel;