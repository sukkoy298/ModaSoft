// src/models/VarianteProductoModel.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

// Definimos la tabla como 'variante_producto' (en minúsculas, como en tu SQL)
const VarianteProductoModel = sequelize.define('variante_producto', {
    id_variante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Debe ser autoIncrement, según tu SQL
        allowNull: false
    },
    id_producto: { // Clave Foránea a la tabla producto
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
    codigo_barras: { // Este campo actuará como nuestro SKU/identificador
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
    // Nombre de la tabla
    tableName: 'variante_producto',
    // Sequelize automáticamente añade createdAt y updatedAt. Los desactivamos si no existen en tu tabla.
    timestamps: false 
});

// Importante: También necesitaremos el modelo ProductoModel.js (simple) para las relaciones

// src/models/ProductoModel.js
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

// Establecer la relación uno-a-muchos (Un Producto tiene muchas Variantes)
ProductoModel.hasMany(VarianteProductoModel, { foreignKey: 'id_producto' });
VarianteProductoModel.belongsTo(ProductoModel, { foreignKey: 'id_producto' });


export { VarianteProductoModel, ProductoModel };