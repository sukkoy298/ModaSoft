import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const VarianteProductoModel = sequelize.define('variante_producto', {
    id_variante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
        allowNull: false,
        unique: true
    },
    precio_unitario_venta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock_actual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'variante_producto',
    timestamps: false 
});

const ProductoModel = sequelize.define('producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_marca: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'producto',
    timestamps: false
});

ProductoModel.hasMany(VarianteProductoModel, { foreignKey: 'id_producto' });
VarianteProductoModel.belongsTo(ProductoModel, { foreignKey: 'id_producto' });


export { VarianteProductoModel, ProductoModel };