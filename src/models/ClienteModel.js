import { DataTypes } from 'sequelize'; // CAMBIO
import { sequelize } from '../../db.js';

// Definimos la tabla como 'cliente' (en minúsculas)
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
    tipo: { // Tipo de cliente (Natural/Jurídico)
        type: DataTypes.STRING(25),
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'cliente',
    timestamps: false // No usa campos createdAt y updatedAt
});

export default ClienteModel;