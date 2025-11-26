import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const MetodoPagoModel = sequelize.define('metodo_pago', {
    id_metodopago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    codigo: {
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
    tableName: 'metodo_pago',
    timestamps: false
});

export default MetodoPagoModel;