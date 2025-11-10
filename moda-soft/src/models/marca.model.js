import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const MarcaModel = sequelize.define('marca', {
    id_marca: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'marca',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default MarcaModel;