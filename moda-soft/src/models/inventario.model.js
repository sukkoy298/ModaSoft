import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const InventarioModel = sequelize.define('inventario', {
    id_inventario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_variante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock_minimo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_ultima_entrada: {
        type: DataTypes.DATE,
        allowNull: false
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
    tableName: 'inventario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default InventarioModel;