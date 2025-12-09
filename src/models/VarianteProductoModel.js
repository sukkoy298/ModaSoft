import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const VarianteProductoModel = sequelize.define('variante_producto', {
    id_variante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    talla: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    codigo_barras: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    precio_unitario_venta: {
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
    },
    costo_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
}, {
    tableName: 'variante_producto',
    timestamps: false
});

export default VarianteProductoModel;