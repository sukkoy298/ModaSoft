// models/MovimientoInventarioModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const MovimientoInventarioModel = sequelize.define('movimiento_inventario', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_variante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['entrada', 'salida', 'ajuste', 'devolucion']]
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    referencia: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'movimiento_inventario',
    timestamps: false
});

export default MovimientoInventarioModel;