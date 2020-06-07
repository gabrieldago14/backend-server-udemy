// Requires
var express = require('express');
var mongoose = require('mongoose');


//Inicializar variables
var app = express();

//Conexion a la base de datos
// MongoClient.connect("mongodb://localhost:27017/hospitalDB", { useNewUrlParser: true })
// mongoose.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true });

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('Conexion base de datos: \x1b[32m%s\x1b[0m', 'online');
});
// mongoose.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true, useUnifiedTopology: true });


//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

//Escuchar petiociones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});