'use strict'

var express = require("express")
var libroRevistaController = require("../controllers/libroRevistaController")
var md_auth = require("../middlewares/authenticated")

//RUTAS
var api = express.Router()
api.post('/agregarLibroRevista/:decision',md_auth.ensureAuth,libroRevistaController.addLibroRevista);
api.put('/actualizarLibroRevista/:libroRevistaId',md_auth.ensureAuth,libroRevistaController.editarLibroRevista);
api.delete('/eliminarLibroRevista/:libroRevistaId',md_auth.ensureAuth,libroRevistaController.eliminarlibroRevista);
api.get('/buscarLibroRevista',md_auth.ensureAuth,libroRevistaController.busquedaLibroRevista);
api.put('/prestamoLibroRevista/:libroRevistaId',md_auth.ensureAuth,libroRevistaController.prestamoLibroRevista);
api.put('/devolucionLibroRevista/:libroRevistaId',md_auth.ensureAuth,libroRevistaController.devolucionLibroRevista);



module.exports = api;