// src/models/CategoriaModel.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js'; 

const CategoriaModel = sequelize.define('categoria', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'categoria',
    timestamps: false 
});

export default CategoriaModel;