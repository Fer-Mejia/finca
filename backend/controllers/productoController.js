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

module.exports = {
  obtenerProductos,
  obtenerProducto
};