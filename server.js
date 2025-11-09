import express from 'express';
import cors from 'cors';
import { connectDB, sequelize } from './db.js';
import { setupAssociations } from './src/models/asociaciones.js';
import clienteRoutes from "./src/server/routes/cliente.route.js";
import productoRoutes from './src/server/routes/producto.route.js'
import categoriaRoutes from './src/server/routes/categoria.route.js';
import marcaRoutes from './src/server/routes/marca.route.js';
import ventaRoutes from './src/server/routes/venta.route.js';

const app = express();
const PORT = 3000; 

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Variable para trackear estado de la BD
let dbConnected = false;

// Conexión a la BD con mejor manejo de errores
async function initializeDatabase() {
    try {
        console.log('🔄 Iniciando conexión a la base de datos...');
        await connectDB();
        dbConnected = true;
        console.log('✅ Conexión a BD establecida correctamente');
        
        // Sincronizar modelos
        console.log('🔄 Sincronizando modelos con la BD...');
        await sequelize.sync({ force: false });
        console.log("✅ Tablas de Sequelize sincronizadas con la BD.");
        
    } catch (error) {
        console.error('❌ Error crítico durante la inicialización de la BD:', error.message);
        dbConnected = false;
    }
}

// Rutas
app.get('/', (req, res) => {
    res.send('Bienvenido a ModaSoft - Sistema de Gestión de Moda');
});

// ⚠️⚠️⚠️ SOLO UNA VEZ ESTA RUTA - ELIMINA EL DUPLICADO ⚠️⚠️⚠️
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'Servidor funcionando correctamente',
        database: dbConnected ? 'Conectada' : 'Desconectada',
        timestamp: new Date().toISOString(),
        message: 'API ModaSoft Online'
    });
});

// Ruta específica para verificar solo la BD
app.get('/api/db-status', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ 
            status: 'BD Conectada',
            database: sequelize.getDatabaseName(),
            dialect: sequelize.getDialect()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'BD Desconectada',
            error: error.message 
        });
    }
});

// Rutas de la API
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/ventas', ventaRoutes);

// ⚠️⚠️⚠️ ELIMINA ESTE BLOQUE DUPLICADO COMPLETO ⚠️⚠️⚠️
/*
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        message: 'API ModaSoft Online'
    });
});
*/

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe en el servidor`
    });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error del servidor:', error);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error.message 
    });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    console.log('🔄 Inicializando base de datos...');
    
    await initializeDatabase();
    
    if (dbConnected) {
        console.log('🎉 Servidor y BD listos para recibir peticiones');
    } else {
        console.log('⚠️  Servidor iniciado pero BD NO CONECTADA');
    }
});