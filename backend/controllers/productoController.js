const productoModel = require('../models/productoModel');

const obtenerProductos = (req, res) => {
  productoModel.getProductos((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const obtenerProducto = (req, res) => {
  const id = req.params.id;
  productoModel.getProductoById(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};

// --- NUEVA: Función para crear ---
const crearProducto = (req, res) => {
  const datos = req.body; // { nombre, precio, imagen, descripcion }
  productoModel.createProducto(datos, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Producto creado', id: result.insertId });
  });
};

// --- NUEVA: Función para eliminar ---
const eliminarProducto = (req, res) => {
  const id = req.params.id;
  productoModel.deleteProducto(id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Producto eliminado' });
  });
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  eliminarProducto
};