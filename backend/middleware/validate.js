const validarPedido = (req, res, next) => {
  const { id_usuario, total } = req.body;

  if (!id_usuario || !total) {
    return res.status(400).json({
      error: 'Faltan datos en el pedido'
    });
  }

  next();
};

module.exports = { validarPedido };