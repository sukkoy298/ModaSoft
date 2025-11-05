// models/DetalleCompraModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const DetalleCompraModel = sequelize.define('detalle_compra', {
    id_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_compra: {
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
    precio_unitario_costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'detalle_compra',
    timestamps: false
});

export default DetalleCompraModel;