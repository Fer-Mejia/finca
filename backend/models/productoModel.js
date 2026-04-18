const db = require('../config/db');

const getProductos = (callback) => {
  db.query('SELECT * FROM productos', callback);
};

const getProductoById = (id, callback) => {
  db.query('SELECT * FROM productos WHERE id_producto = ?', [id], callback);
};

module.exports = {
  getProductos,
  getProductoById
};