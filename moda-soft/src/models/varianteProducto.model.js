import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

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
    stock_actual: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'stock_actual' 
    }
}, {
    tableName: 'variante_producto',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default VarianteProductoModel;