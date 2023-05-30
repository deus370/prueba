const express = require("express");
const mysql = require("mysql");
const axios = require('axios');
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "login",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: ", err);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  const query = "SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?";
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


app.post('/logs', (req, res) => {
  const { usuario, accion } = req.body;
  const query = 'INSERT INTO logs (usuario, accion) VALUES (?, ?)';
  const values = [usuario, accion];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ 
        ok: false,
        error: 'Ocurrió un error al agregar el registro' });
      return;
    }

    res.json({ 
      ok: true,
      message: 'Registro agregado correctamente' });
  });
});
let data;

app.get('/personajes', async(req, res) => {

  axios.get('https://rickandmortyapi.com/api/character')
    .then(response => {
      res.json({
        ok: true,
        data: response.data.results});
      return;
    })
    .catch(error => {
      console.error('Error al obtener las películas populares:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener las películas populares' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
  connection;
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
