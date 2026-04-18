const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoController');

// Rutas existentes
router.get('/', controller.obtenerProductos);
router.get('/:id', controller.obtenerProducto);

// --- ESTA ES LA LÍNEA QUE FALTA ---
// Cuando Angular hace un POST a /api/productos, se ejecuta crearProducto
router.post('/', controller.crearProducto); 

router.put('/:id', controller.editarProducto);

// También añade esta para que funcione el botón de eliminar
router.delete('/:id', controller.eliminarProducto);

module.exports = router;