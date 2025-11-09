import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Logging simple para depuración
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`)
  next()
})


// Rutas API
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.get('/api/clientes', (req, res) => {
  return res.json(clientes)
})

app.get('/api/clientes/:cedula', (req, res) => {
  const c = clientes.find(x => x.cedula === req.params.cedula)
  if (!c) return res.status(404).json({ message: 'Cliente no encontrado' })
  return res.json(c)
})

app.post('/api/clientes', (req, res) => {
  const nuevo = { ...req.body }
  clientes.push(nuevo)
  return res.status(201).json(nuevo)
})

app.put('/api/clientes/:cedula', (req, res) => {
  const idx = clientes.findIndex(x => x.cedula === req.params.cedula)
  if (idx === -1) return res.status(404).json({ message: 'Cliente no encontrado' })
  clientes[idx] = { ...clientes[idx], ...req.body }
  return res.json(clientes[idx])
})

app.delete('/api/clientes/:cedula', (req, res) => {
  const prevLen = clientes.length
  clientes = clientes.filter(x => x.cedula !== req.params.cedula)
  if (clientes.length === prevLen) return res.status(404).json({ message: 'Cliente no encontrado' })
  return res.json({ message: 'Eliminado' })
})

// Servir index.html en desarrollo si se accede por 3000
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Servir build en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

process.on('uncaughtException', (err) => {
  console.error('UncaughtException', err && err.stack ? err.stack : err)
})
process.on('unhandledRejection', (reason) => {
  console.error('UnhandledRejection', reason && reason.stack ? reason.stack : reason)
})

app.listen(port, () => {
  console.log(`API server escuchando en http://localhost:${port} - PID ${process.pid}`)
})