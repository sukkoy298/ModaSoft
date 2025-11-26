import express from 'express';
import cors from 'cors';
import { connectDB, sequelize } from './db.js';
import { setupAssociations } from './src/models/asociaciones.js';
import clienteRoutes from "./src/server/routes/cliente.route.js";
import productoRoutes from './src/server/routes/producto.route.js';
import categoriaRoutes from './src/server/routes/categoria.route.js';
import marcaRoutes from './src/server/routes/marca.route.js';

import proveedorRoutes from './src/server/routes/proveedor.route.js';
import usuarioRoutes from './src/server/routes/usuario.route.js';
import compraRoutes from './src/server/routes/compra.route.js';
import ventaRoutes from './src/server/routes/venta.route.js';
import devolucionRoutes from './src/server/routes/devolucion.route.js';
import inventarioRoutes from './src/server/routes/inventario.route.js'; 
import rolUsuarioRoutes from './src/server/routes/rolUsuario.route.js';
import metodoPagoRoutes from './src/server/routes/metodoPago.route.js';
import reportesRoute from './src/server/routes/reportes.route.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json()); 

// Conexión a la BD
connectDB(); 

// Rutas
app.get('/', (req, res) => {
    res.send('Bienvenido a ModaSoft - Sistema de Gestión de Moda');
});

// Rutas
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/marcas', marcaRoutes);

app.use('/api/roles', rolUsuarioRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/devoluciones', devolucionRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/metodos-pago', metodoPagoRoutes);
app.use('/api/reportes', reportesRoute);

// Ruta para verificar estado del servidor
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

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
    
    try {
        await sequelize.sync({ force: false }); 
        console.log("✅ Tablas de Sequelize sincronizadas con la BD.");
    } catch (error) {
        console.error("❌ Error al sincronizar modelos:", error.message);
    }
});