const pedidoModel = require('../models/pedidoModel');
const detalleModel = require('../models/detalleModel');
const db = require('../config/db');

const crearPedido = (req, res) => {
  const { id_usuario, total, productos } = req.body;

  pedidoModel.crearPedido({ id_usuario, total }, (err, result) => {
    if (err) return res.status(500).json(err);

    const id_pedido = result.insertId;

    detalleModel.insertarDetalle(id_pedido, productos, (err2) => {
      if (err2) return res.status(500).json(err2);

      res.json({
        mensaje: 'Pedido completo creado',
        id_pedido
      });
    });
  });
};

const listarPedidos = (req, res) => {
  pedidoModel.obtenerPedidos((err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

const pedidosUsuario = (req, res) => {
  const id = req.params.id;

  pedidoModel.pedidosPorUsuario(id, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

const pedidosDetallados = (req, res) => {
  pedidoModel.obtenerPedidosDetallados((err, rows) => {
    if (err) return res.status(500).json(err);

    if (rows.length === 0) {
      return res.json({ mensaje: "No hay pedidos" });
    }

    const pedido = {
      id_pedido: rows[0].id_pedido,
      usuario: rows[0].nombre,
      productos: []
    };

    rows.forEach(r => {
      pedido.productos.push({
        nombre: r.producto,
        cantidad: r.cantidad
      });
    });

    res.json(pedido);
  });
};

const obtenerDetallePorId = (req, res) => {
  const id = req.params.id;
  db.query(`
    SELECT pr.nombre, d.cantidad, pr.precio 
    FROM detalle_pedido d
    JOIN productos pr ON d.id_producto = pr.id_producto
    WHERE d.id_pedido = ?`, [id], (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    });
};

const pagarPedido = (req, res) => {
  const { id_pedido } = req.body;

  db.query(
    'UPDATE pedidos SET estado = "pagado" WHERE id_pedido = ?',
    [id_pedido],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ mensaje: "Pago realizado 💳" });
    }
  );
};

module.exports = {
  crearPedido,
  listarPedidos,
  pedidosUsuario,
  pedidosDetallados,
  pagarPedido,
  obtenerDetallePorId
};