'use strict'

var express = require("express")
var usuarioController = require("../controllers/usuarioController")
var md_auth = require("../middlewares/authenticated")

//RUTAS
var api = express.Router()
api.post('/addUsuario',md_auth.ensureAuth,usuarioController.addUsuario);
api.post('/login',usuarioController.loginUsuario);


module.exports = api;