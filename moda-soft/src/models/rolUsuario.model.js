import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const RolUsuarioModel = sequelize.define('rol_usuario', {
    id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rol: {
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
    tableName: 'rol_usuario',
    timestamps: false
});

export default RolUsuarioModel;