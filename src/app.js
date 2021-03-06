'use strict'

// VARIABLE GOLBALES
const express = require("express")
const app = express();
const bodyParser = require("body-parser")

//CARGA DE RUTAS
var usuario_routes = require("./routes/usuarioRoutes")
var libroRevista_routes = require("./routes/libroRevistaRoutes")



//MIDDLEWARES
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//CABECERAS
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET. POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');

    next();
})

//RUTAS
app.use('/api',usuario_routes,libroRevista_routes)



//EXPORTAR
module.exports = app;