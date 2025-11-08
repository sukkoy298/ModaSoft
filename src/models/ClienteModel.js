import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const ClienteModel = sequelize.define('cliente', {
    cedula: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    tipo: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'cliente',
    timestamps: false
});

export default ClienteModel;