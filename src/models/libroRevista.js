'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var libroRevistaSchema = Schema({
    categoria: {type: String, require: true},
    autor: {type: String, require: true},
    titulo: {type: String, require: true},
    edicion: {type: Number, require: true},
    palabrasClave: {
        palabraClave: String,
    },
    descripcion:{type: String, require: true},
    temas: {
        tema: String,
    },
    copias: {type: Number, require: true},
    disponibles: {type: Number, require: true},
    //Solo para revistas
    frecuenciaActual: String,
    ejemplares: Number
})

module.exports = mongoose.model('libroRevista', libroRevistaSchema)