import { Sequelize } from 'sequelize';

//Crear conexion
const sequelize = new Sequelize('modasoft', 'root', '',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false, //desactiva los logs de consola
});

const connectDB = async () => {
    try{
        await sequelize.authenticate();
        console.log('Se ha conectado correctamente a MySQL con Sequelize');
    }
    catch(error){
        console.error('Ha ocurrido un error al conectar a MySQL', error);
    }
};

export { sequelize, connectDB };