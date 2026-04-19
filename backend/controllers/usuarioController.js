const usuarioModel = require('../models/usuarioModel');
const db = require('../config/db');

const registrarUsuario = (req, res) => {
  usuarioModel.crearUsuario(req.body, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      mensaje: 'Usuario creado',
      id: result.insertId
    });
  });
};

const listarUsuarios = (req, res) => {
  usuarioModel.obtenerUsuarios((err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

const login = (req, res) => {
  // 1. Ver qué llega desde Angular
  console.log("--- INTENTO DE LOGIN ---");
  console.log("Payload recibido:", req.body); 

  const { correo, password } = req.body;

  // 2. Limpiar datos por si hay espacios invisibles
  const cLimpio = correo ? correo.trim() : '';
  const pLimpia = password ? password.trim() : '';

  // 3. Consulta que ignora espacios y mayúsculas
  const sql = 'SELECT * FROM usuarios WHERE TRIM(LOWER(correo)) = TRIM(LOWER(?)) AND TRIM(password) = ?';

  db.query(sql, [cLimpio, pLimpia], (err, result) => {
    if (err) {
      console.error("ERROR SQL:", err);
      return res.status(500).json(err);
    }

    console.log("Usuarios encontrados en DB:", result.length);

    if (result.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    res.json({ mensaje: "Login exitoso", usuario: result[0] });
  });
};

const repararTodo = (req, res) => {
  // 1. Definimos las consultas de estructura
  const consultasEstructura = [
    "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'cliente'",
    "ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen VARCHAR(255) DEFAULT NULL",
    "UPDATE pedidos SET estado = 'pendiente' WHERE estado IS NULL OR estado = ''"
  ];

  // Ejecutar cambios de estructura uno por uno
  consultasEstructura.forEach(sql => {
    db.query(sql, (err) => { if (err) console.log("Nota: Columna ya existe o ", err.message); });
  });

  // 2. Darle el poder de Admin a Miguel
  const sqlAdmin = "UPDATE usuarios SET rol = 'admin' WHERE correo = 'miguel@test.com'";
  
  // 3. Vincular imágenes a tus productos (ID 1, 2 y 3)
  const sqlFotos = `
    INSERT INTO productos (id_producto, nombre, imagen) 
    VALUES 
    (1, 'Café Americano', 'assets/americano.png'),
    (2, 'Latte', 'assets/latte.png'),
    (3, 'Capuchino', 'assets/capuchino.png')
    ON DUPLICATE KEY UPDATE imagen = VALUES(imagen)
  `;

  db.query(sqlAdmin, () => {
    db.query(sqlFotos, (err) => {
      if (err) return res.status(500).send("Error en reparación: " + err.message);
      res.send(`
        <div style="font-family: Arial; text-align: center; margin-top: 50px;">
          <h1 style="color: #2ecc71;">✅ ¡Base de Datos Sincronizada!</h1>
          <p style="font-size: 1.2em;">Miguel ahora es <b>Admin</b> y los productos tienen sus <b>imágenes</b> vinculadas.</p>
          <p>Ya puedes cerrar esta pestaña y volver a tu App.</p>
        </div>
      `);
    });
  });
};



module.exports = {
  registrarUsuario,
  listarUsuarios,
  login,
  repararTodo
};