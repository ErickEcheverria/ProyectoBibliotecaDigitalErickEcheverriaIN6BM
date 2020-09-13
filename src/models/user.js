'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UserSchema = Schema({
    usuario: String,
    carnet: Number,
    cui: String, //Añadir solamente si es un catedratico
    nombre: {type: String, require: true},
    apellido: String,
    rol: {type: String, require: true},
    password: {type: String, require: true},
    librosRevistasPrestados: {
        idLibroRevista: {type: Schema.ObjectId, ref:'libroRevista'},
    },
    cantidadDeLibrosPrestado : Number
})

module.exports = mongoose.model('user', UserSchema)