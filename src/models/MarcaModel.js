import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const MarcaModel = sequelize.define('marca', {
    id_marca: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
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
    tableName: 'marca',
    timestamps: false
});

export default MarcaModel;