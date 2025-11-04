import express from 'express';
import cors from 'cors';
import { connectDB, sequelize } from './db.js';
import clienteRoutes from "./src/server/routes/cliente.route.js"; // ✅ Esta ruta

const app = express();
const PORT = 3000; 

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Conexión a la BD
connectDB(); 

// Rutas
app.get('/', (req, res) => {
    res.send('Bienvenido a mi servidor con Express!');
});

// ✅ Asegúrate de que esta línea esté presente
app.use('/api/clientes', clienteRoutes);

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    
    try {
        await sequelize.sync({ alter: true }); 
        console.log("✅ Tablas de Sequelize sincronizadas con la BD.");
    } catch (error) {
        console.error("❌ Error al sincronizar modelos:", error.message);
    }
});