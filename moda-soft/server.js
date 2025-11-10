import express from 'express'
import { sequelize } from '../moda-soft/src/config/db.js';
import { setupAssociations } from '../moda-soft/src/models/relaciones.js'; //le indicamos a sequelize que obtenga todas las relaciones entre tablas
import inventarioRoutes from '../moda-soft/src/routes/inventario.route.js';

const app = express();
const PORT = 3000;

//Middleware para procesar JSON
app.use(express.json());

//Inicializamos relaciones
setupAssociations();

//Verificacion de que la conexion a la BD se haya hecho correctamente
sequelize.sync({ force: false }) // force: false para no borrar la DB cada vez
    .then(() => console.log('Base de datos y modelos sincronizados.'))
    .catch(err => console.error('Error al sincronizar la base de datos:', err));

//Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a mi servidor con Express');
});

//Rutas
app.use('/api/inventario', inventarioRoutes);

//Iniciar servidor
app.listen(PORT, () =>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
});