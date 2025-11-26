import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const ClienteModel = sequelize.define('cliente', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cedula: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    direccion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    tipo: {
        type: DataTypes.ENUM('Natural', 'Jurídico', 'Genérico'),
        allowNull: false,
        defaultValue: 'Natural'
    },
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    tableName: 'cliente',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: 'updated_at',
    defaultScope: {
        where: { activo: true }
    }
});

export default ClienteModel;