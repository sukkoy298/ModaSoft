import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'modasoft2',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mysql',
        timezone: process.env.TIMEZONE || '-04:00',
        dialectOptions: {
            charset: 'utf8mb4',
            dateStrings: true,
            typeCast: true
        },
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        },
        logging: false,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conectado correctamente a MySQL con Sequelize.');
    } catch (error) {
        console.error('❌ Error al conectar a MySQL con Sequelize:', error.message);
        console.log('Asegúrate de que MySQL Server esté corriendo y las credenciales sean correctas.');
    }
};

export { sequelize, connectDB };