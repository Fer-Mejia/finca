const db = require('../config/db');

// Obtener todos los productos
const getProductos = (callback) => {
  db.query('SELECT * FROM productos', callback);
};

// Obtener un solo producto por su ID
const getProductoById = (id, callback) => {
  db.query('SELECT * FROM productos WHERE id_producto = ?', [id], callback);
};

// --- NUEVA: Crear un producto en la base de datos ---
const createProducto = (datos, callback) => {
  const { nombre, precio, imagen, descripcion } = datos;
  const sql = 'INSERT INTO productos (nombre, precio, imagen, descripcion) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [nombre, precio, imagen, descripcion], callback);
};

// --- NUEVA: Eliminar un producto por su ID ---
const deleteProducto = (id, callback) => {
  const sql = 'DELETE FROM productos WHERE id_producto = ?';
  
  db.query(sql, [id], callback);
};

// Exportamos todas las funciones para que el controlador las use
module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  deleteProducto
};