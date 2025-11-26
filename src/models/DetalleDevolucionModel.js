import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const DetalleDevolucionModel = sequelize.define('detalle_devolucion', {
    id_detalledevolucion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_devolucion: {
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
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'detalle_devolucion',
    timestamps: false
});

export default DetalleDevolucionModel;