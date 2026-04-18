const usuarioModel = require('../models/usuarioModel');
const db = require('../config/db');

const registrarUsuario = (req, res) => {
  usuarioModel.crearUsuario(req.body, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      mensaje: 'Usuario creado',
      id: result.insertId
    });
  });
};

const listarUsuarios = (req, res) => {
  usuarioModel.obtenerUsuarios((err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

const login = (req, res) => {
  // 1. Ver qué llega desde Angular
  console.log("--- INTENTO DE LOGIN ---");
  console.log("Payload recibido:", req.body); 

  const { correo, password } = req.body;

  // 2. Limpiar datos por si hay espacios invisibles
  const cLimpio = correo ? correo.trim() : '';
  const pLimpia = password ? password.trim() : '';

  // 3. Consulta que ignora espacios y mayúsculas
  const sql = 'SELECT * FROM usuarios WHERE TRIM(LOWER(correo)) = TRIM(LOWER(?)) AND TRIM(password) = ?';

  db.query(sql, [cLimpio, pLimpia], (err, result) => {
    if (err) {
      console.error("ERROR SQL:", err);
      return res.status(500).json(err);
    }

    console.log("Usuarios encontrados en DB:", result.length);

    if (result.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    res.json({ mensaje: "Login exitoso", usuario: result[0] });
  });
};

module.exports = {
  registrarUsuario,
  listarUsuarios,
  login
};