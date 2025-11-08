import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('modasoft1', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-04:00', // Zona horaria de Caracas (UTC-4)
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
    logging: false, 
});

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