// models/UsuarioModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const UsuarioModel = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            isIn: [['admin', 'vendedor', 'contador']]
        }
    },
    estado: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'activo'
    },
    fecha_creacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});

export default UsuarioModel;