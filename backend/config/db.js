const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 12722, // Agregamos el puerto
  ssl: {
    rejectUnauthorized: false // ¡ESTO ES VITAL para Aiven y Render!
  }
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexion:', err);
    return;
  }
  console.log('Conectado a la base de datos de Aiven');
});

module.exports = connection;