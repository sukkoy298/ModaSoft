import express from 'express';
import { 
  getInventarioCompleto, 
  registrarMovimiento,
  ajustarVariante,
  eliminarVarianteLogicamente
} from '../controllers/inventario.controller.js';

const router = express.Router();

// Ruta: GET /api/inventario/ 
router.get('/', getInventarioCompleto);
router.post('/movimiento', registrarMovimiento);
router.put('/:id_variante', ajustarVariante);
router.delete('/:id_variante', eliminarVarianteLogicamente);

export default router;