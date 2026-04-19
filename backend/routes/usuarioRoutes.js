const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');

router.post('/', controller.registrarUsuario);
router.get('/', controller.listarUsuarios);
router.post('/login', controller.login);
router.get('/config/reparar-base-de-datos', usuariosController.repararTodo);

module.exports = router;