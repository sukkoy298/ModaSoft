import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

// Ajustes por defecto para XAMPP / MySQL
const DIALECT = process.env.DIALECT || 'mysql'
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 3306
const DB_NAME = process.env.DB_NAME || 'modasoft2'
const DB_USER = process.env.DB_USER || 'root'       // usuario por defecto en XAMPP
const DB_PASS = process.env.DB_PASS || ''           // contraseña por defecto suele estar vacía en XAMPP

console.log('🔧 Configuración de BD:', {
  DIALECT,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS: DB_PASS ? '***' : '(vacía)'
})

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DIALECT,
  logging: (msg) => console.log('[BD]', msg),
  timezone: '+00:00'
})

export async function connectDB() {
  try {
    console.log('🔌 Conectando a la base de datos MySQL...')
    console.log(`   📍 Host: ${DB_HOST}:${DB_PORT}`)
    console.log(`   📊 Base de datos: ${DB_NAME}`)
    console.log(`   👤 Usuario: ${DB_USER}`)

    await sequelize.authenticate()
    console.log('✅ Conexión a la base de datos establecida correctamente')
    return true
  } catch (err) {
    console.error('❌ Error al conectar a la BD:')
    console.error(`   💡 Error detallado: ${err.message}`)
    throw err
  }
}