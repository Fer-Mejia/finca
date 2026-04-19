const express = require('express');
const router = express.Router();
// Aquí lo llamamos 'controller' para que coincida con tus otras rutas
const controller = require('../controllers/usuarioController'); 

router.post('/', controller.registrarUsuario);
router.get('/', controller.listarUsuarios);
router.post('/login', controller.login);

// AQUÍ EL CAMBIO: Usamos 'controller' en lugar de 'usuariosController'
router.get('/reparar', controller.repararTodo);

module.exports = router;