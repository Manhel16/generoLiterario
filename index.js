const express = require("express");
const morgan = require('morgan');
const app = express();
const path = require('path');
const puerto = 3000;
const generoLiterarioRouter = require('./routes/generoLiterario');
const novelaRouter = require('./routes/novela');

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Definir ruta principal
app.get("/", (req, res) => {
  res.json({ mensaje: "ok" });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/indexHtml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Enrutador para los endpoints relacionados con generoLiterario
app.use("/generoLiterario", generoLiterarioRouter);
app.use("/novela", novelaRouter)

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`Aplicación de ejemplo escuchando en http://localhost:${puerto}`);
});
