// models/CuentaPorCobrarModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const CuentaPorCobrarModel = sequelize.define('cuenta_por_cobrar', {
    id_cxc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_venta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cobrado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    fecha_cobro: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'cuenta_por_cobrar',
    timestamps: false
});

export default CuentaPorCobrarModel;