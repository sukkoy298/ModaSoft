// models/DetalleVentaModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const DetalleVentaModel = sequelize.define('detalle_venta', {
    id_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_venta: {
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
    },
    precio_unitario_venta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'detalle_venta',
    timestamps: false
});

export default DetalleVentaModel;