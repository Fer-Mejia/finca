const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');

router.post('/', controller.registrarUsuario);
router.get('/', controller.listarUsuarios);
router.post('/login', controller.login);

module.exports = router;