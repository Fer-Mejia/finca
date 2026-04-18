const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoController');
const { validarPedido } = require('../middleware/validate');

// 1. Creación
router.post('/', validarPedido, controller.crearPedido);

// 2. Rutas de "Detalle" 
// Esta es la que usa el modal de Angular: /api/pedidos/detalle/4
router.get('/detalle/:id', controller.obtenerDetallePorId); 
router.get('/detalle', controller.pedidosDetallados); 

// 3. Listados y Actualizaciones
router.get('/', controller.listarPedidos);
router.put('/pagar', controller.pagarPedido);

// 4. Parámetros generales (SIEMPRE AL FINAL)
router.get('/:id', controller.pedidosUsuario);

module.exports = router;