const db = require('../config/db');

// Obtener todos los productos
const getProductos = (callback) => {
  db.query('SELECT * FROM productos', callback);
};

// Obtener un solo producto por su ID
const getProductoById = (id, callback) => {
  db.query('SELECT * FROM productos WHERE id_producto = ?', [id], callback);
};

// Crear producto (Incluyendo stock)
const createProducto = (datos, callback) => {
  const { nombre, precio, imagen, descripcion, stock } = datos;
  const sql = 'INSERT INTO productos (nombre, precio, imagen, descripcion, stock) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [nombre, precio, imagen, descripcion, stock], callback);
};

// Actualizar producto (Incluyendo stock)
const updateProducto = (id, datos, callback) => {
  const { nombre, precio, imagen, descripcion, stock } = datos;
  const sql = 'UPDATE productos SET nombre=?, precio=?, imagen=?, descripcion=?, stock=? WHERE id_producto=?';
  
  db.query(sql, [nombre, precio, imagen, descripcion, stock, id], callback);
};

// Eliminar producto
const deleteProducto = (id, callback) => {
  const sql = 'DELETE FROM productos WHERE id_producto = ?';
  db.query(sql, [id], callback);
};

// --- IMPORTANTE: Exportar TODAS las funciones ---
module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto, 
  deleteProducto
};