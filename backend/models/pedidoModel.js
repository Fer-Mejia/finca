const db = require('../config/db');

const crearPedido = (data, callback) => {
  const { id_usuario, total } = data;

  db.query(
    'INSERT INTO pedidos (id_usuario, fecha, total) VALUES (?, NOW(), ?)',
    [id_usuario, total],
    callback
  );
};

const obtenerPedidos = (callback) => {
  db.query('SELECT * FROM pedidos', callback);
};

const pedidosPorUsuario = (id, callback) => {
  db.query(
    'SELECT * FROM pedidos WHERE id_usuario = ?',
    [id],
    callback
  );
};

const obtenerPedidosDetallados = (callback) => {
  db.query(`
    SELECT 
      p.id_pedido,
      u.nombre,
      pr.nombre AS producto,
      d.cantidad
    FROM pedidos p
    JOIN usuarios u ON p.id_usuario = u.id_usuario
    JOIN detalle_pedido d ON p.id_pedido = d.id_pedido
    JOIN productos pr ON d.id_producto = pr.id_producto
  `, callback);
};

module.exports = {
  crearPedido,
  obtenerPedidos,
  pedidosPorUsuario,
  obtenerPedidosDetallados
};