// models/CuentaPorPagarModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const CuentaPorPagarModel = sequelize.define('cuenta_por_pagar', {
    id_cxp: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_compra: {
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
    pagado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    fecha_pago: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'cuenta_por_pagar',
    timestamps: false
});

export default CuentaPorPagarModel;