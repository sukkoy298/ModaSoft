// models/DetalleDevolucionModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const DetalleDevolucionModel = sequelize.define('detalle_devolucion', {
    id_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_devolucion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_variante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'detalle_devolucion',
    timestamps: false
});

export default DetalleDevolucionModel;