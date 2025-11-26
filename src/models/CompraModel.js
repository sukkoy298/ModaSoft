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
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    nro_factura: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
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
    tableName: 'compra',
    timestamps: false
});

export default CompraModel;