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
        allowNull: false,
        references: {
            model: 'compra',
            key: 'id_compra'
        }
    },
    id_variante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'variante_producto',
            key: 'id_variante'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    precio_unitario_costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'detalle_compra',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default DetalleCompraModel;