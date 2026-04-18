const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoController');

router.get('/', controller.obtenerProductos);
router.get('/:id', controller.obtenerProducto);

module.exports = router;