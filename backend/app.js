const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Verifica que esta ruta a db.js sea correcta
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// RUTA DE EMERGENCIA (Directa, sin prefijos)
app.get('/reparar', (req, res) => {
    console.log("Ejecutando reparación...");
    const sqlAdmin = "UPDATE usuarios SET rol = 'admin' WHERE correo = 'miguel@test.com'";
    const sqlFotos = "UPDATE productos SET imagen = 'assets/americano.png' WHERE id_producto = 1"; // Prueba con uno
    
    db.query(sqlAdmin, (err) => {
        if (err) return res.status(500).send("Error Admin: " + err.message);
        
        db.query(sqlFotos, (err2) => {
            if (err2) return res.status(500).send("Error Fotos: " + err2.message);
            res.send("<h1>🚀 ¡REPARACIÓN EXITOSA! Miguel es Admin.</h1>");
        });
    });
});

// Ruta base para confirmar que el archivo cargó
app.get('/', (req, res) => {
    res.send('Servidor Vivo y Operando');
});

// Rutas normales (déjalas por si acaso)
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/productos', require('./routes/productoRoutes'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor en puerto ${PORT}`);
});