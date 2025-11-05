// models/VentaModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const VentaModel = sequelize.define('venta', {
    id_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cedula_cliente: {
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
            isIn: [['pagada', 'pendiente', 'anulada']]
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'venta',
    timestamps: false
});

export default VentaModel;