'use strict'

var express = require("express")
var libroRevistaController = require("../controllers/libroRevistaController")
var md_auth = require("../middlewares/authenticated")

//RUTAS
var api = express.Router()
api.post('/agregarLibroRevista/:decision',md_auth.ensureAuth,libroRevistaController.addLibroRevista);
api.put('/actualizarLibroRevista/:libroRevistaId',md_auth.ensureAuth,libroRevistaController.editarLibroRevista);
api.delete('/eliminarLibroRevista/:libroRevistaId',md_auth.ensureAuth,libroRevistaController.eliminarlibroRevista);



module.exports = api;