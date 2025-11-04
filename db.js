// db.js (Raíz) - CONVERTIDO A ES MODULES

import { Sequelize } from 'sequelize'; // CAMBIO

// Crea la conexión. 
const sequelize = new Sequelize('modasoft1', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, 
});

// Función para probar la conexión
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conectado correctamente a MySQL con Sequelize.');
    } catch (error) {
        console.error('❌ Error al conectar a MySQL con Sequelize:', error.message);
        console.log('Asegúrate de que MySQL Server esté corriendo y las credenciales sean correctas.');
    }
};

export { sequelize, connectDB }; // CAMBIO