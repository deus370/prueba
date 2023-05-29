const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "login",
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: ", err);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

// Middleware para habilitar CORS
app.use(cors());
app.use(express.json());

// Ruta para validar el usuario y contraseña
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  const query = "SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?";
  // Llamar al procedimiento almacenado
  connection.query(query, [usuario, password], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Ocurrió un error al iniciar sesión" });
      return;
    }

    if (results.length > 0) {
      // Usuario válido, enviar respuesta de éxito
      res.json({
        ok: true,
        message: "Inicio de sesión exitoso",
      });
    } else {
      // Usuario inválido, enviar respuesta de error
      res.status(401).json({
        ok: false,
        error: "Credenciales inválidas",
      });
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  connection;
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
