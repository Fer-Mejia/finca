const db = require('../config/db');

const insertarDetalle = (id_pedido, productos, callback) => {
  const values = productos.map(p => [
    id_pedido,
    p.id_producto,
    p.cantidad
  ]);

  db.query(
    'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad) VALUES ?',
    [values],
    callback
  );
};

module.exports = { insertarDetalle };