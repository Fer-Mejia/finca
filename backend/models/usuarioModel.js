const db = require('../config/db');

const crearUsuario = (data, callback) => {
  const { nombre, correo, password } = data;

  db.query(
    'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
    [nombre, correo, password],
    callback
  );
};

const obtenerUsuarios = (callback) => {
  db.query('SELECT * FROM usuarios', callback);
};

module.exports = {
  crearUsuario,
  obtenerUsuarios
};