// models/CompraModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const CompraModel = sequelize.define('compra', {
    id_compra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cedula_proveedor: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            isIn: [['pendiente', 'pagada', 'anulada']]
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'compra',
    timestamps: false
});

export default CompraModel;