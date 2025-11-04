// src/models/MarcaModel.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js'; 

const MarcaModel = sequelize.define('marca', {
    id_marca: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'marca',
    timestamps: false 
});

export default MarcaModel;