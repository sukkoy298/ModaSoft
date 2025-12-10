import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const CatalogoCuentaModel = sequelize.define('CatalogoCuenta', {
    id_cuenta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('DEBE', 'HABER'),
        allowNull: false
    },
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'catalogo_cuentas',
    timestamps: true,
});

export default CatalogoCuentaModel;