import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const DetalleCompraModel = sequelize.define('detalle_compra', {
    id_detallecompra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    tableName: 'detalle_compra',
    timestamps: false
});

export default DetalleCompraModel;