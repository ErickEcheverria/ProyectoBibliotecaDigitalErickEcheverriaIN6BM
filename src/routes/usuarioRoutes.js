'use strict'

var express = require("express")
var usuarioController = require("../controllers/usuarioController")
var md_auth = require("../middlewares/authenticated")

//RUTAS
var api = express.Router()
api.post('/addUsuario',md_auth.ensureAuth,usuarioController.addUsuario);
api.post('/login',usuarioController.loginUsuario);
api.get('/verUsuarios',md_auth.ensureAuth,usuarioController.verUsuarios);
api.delete('/eliminarUsuario/:usuarioId',md_auth.ensureAuth,usuarioController.eliminarUsuario);
api.put('/actualizarUsuario/:usuarioId',md_auth.ensureAuth,usuarioController.editarUsuario);



module.exports = api;