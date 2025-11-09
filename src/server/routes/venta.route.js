import { Router } from 'express';

// /src/server/routes/facturacion.route.js
const router = Router();

// Almacenamiento en memoria (puede reemplazarse por DB/Controller)
let facturas = [];
let nextId = 1;

// Helpers
const generarId = () => String(nextId++);
const findIndex = id => facturas.findIndex(f => f.id === id);

// Validación mínima
function validarFactura(body) {
    const errors = [];
    if (!body.cliente || typeof body.cliente !== 'string') errors.push('cliente (string) requerido');
    if (!Array.isArray(body.items) || body.items.length === 0) errors.push('items (array) requerido');
    if (typeof body.total !== 'number' || isNaN(body.total)) errors.push('total (number) requerido');
    return errors;
}

// Listar todas las facturas
router.get('/', (req, res) => {
    res.json(facturas);
});

// Obtener una factura por id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const factura = facturas.find(f => f.id === id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
});

// Crear nueva factura
router.post('/', (req, res) => {
    const body = req.body || {};
    const errors = validarFactura(body);
    if (errors.length) return res.status(400).json({ errors });

    const nueva = {
        id: generarId(),
        cliente: body.cliente,
        items: body.items,
        total: body.total,
        fecha: body.fecha || new Date().toISOString(),
        estado: body.estado || 'pendiente',
        notas: body.notas || ''
    };
    facturas.push(nueva);
    res.status(201).json(nueva);
});

// Actualizar factura (parcial o completo)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const idx = findIndex(id);
    if (idx === -1) return res.status(404).json({ error: 'Factura no encontrada' });

    const body = req.body || {};
    // Si vienen campos, los aplicamos; validación mínima opcional
    if (body.cliente !== undefined) facturas[idx].cliente = body.cliente;
    if (body.items !== undefined) facturas[idx].items = body.items;
    if (body.total !== undefined) facturas[idx].total = body.total;
    if (body.fecha !== undefined) facturas[idx].fecha = body.fecha;
    if (body.estado !== undefined) facturas[idx].estado = body.estado;
    if (body.notas !== undefined) facturas[idx].notas = body.notas;

    res.json(facturas[idx]);
});

// Eliminar factura
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const idx = findIndex(id);
    if (idx === -1) return res.status(404).json({ error: 'Factura no encontrada' });
    const eliminado = facturas.splice(idx, 1)[0];
    res.json({ deleted: eliminado });
});

export default router;