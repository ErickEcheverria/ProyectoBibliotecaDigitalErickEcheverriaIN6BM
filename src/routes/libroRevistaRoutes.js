'use strict'

var express = require("express")
var libroRevistaController = require("../controllers/libroRevistaController")
var md_auth = require("../middlewares/authenticated")

//RUTAS
var api = express.Router()
api.post('/agregarLibroRevista/:decision',md_auth.ensureAuth,libroRevistaController.addLibroRevista);



module.exports = api;