import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const CompraModel = sequelize.define('compra', {
    id_compra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cedula_proveedor: {
        type: DataTypes.STRING(30),
        allowNull: false,
        references: {
            model: 'proveedor',
            key: 'doc_identidad'
        }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    nro_factura: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    iva: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
    tableName: 'compra',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default CompraModel;