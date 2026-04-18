const productoModel = require('../models/productoModel');

// 1. Obtener todos
const obtenerProductos = (req, res) => {
  productoModel.getProductos((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// 2. Obtener uno solo
const obtenerProducto = (req, res) => {
  const id = req.params.id;
  productoModel.getProductoById(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};

// 3. Crear (POST)
const crearProducto = (req, res) => {
  const datos = req.body; 
  productoModel.createProducto(datos, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Producto creado', id: result.insertId });
  });
};

// 4. Editar (PUT)
const editarProducto = (req, res) => {
  const { id } = req.params;
  const datos = req.body;
  
  productoModel.updateProducto(id, datos, (err, result) => {
    if (err) {
      console.error('Error al actualizar:', err);
      return res.status(500).json(err);
    }
    res.json({ message: 'Producto actualizado con éxito' });
  });
};

// 5. Eliminar (DELETE)
const eliminarProducto = (req, res) => {
  const id = req.params.id;
  productoModel.deleteProducto(id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Producto eliminado' });
  });
};

// Exportación de todas las funciones
module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  editarProducto,
  eliminarProducto
};