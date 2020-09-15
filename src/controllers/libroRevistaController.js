'use strict'

//IMPORTS
var bcrypt = require("bcrypt-nodejs"); 
var LibroRevista = require('../models/libroRevista');
var User = require('../models/user');
var jwt = require('../services/jwt');
var path = require("path");
var fs = require('fs');
const rol = "admin";

function addLibroRevista(req,res){
    var libro_o_Revista = req.params.decision;
    var libroRevista = new LibroRevista();
    var params = req.body;
    
    if(rol == req.user.rol){
        if(params.copias >= params.disponibles){
            switch (libro_o_Revista) {
                case 'libro':

                var parametroPalabrasClave = req.body.palabrasClave;
                var datoPC = parametroPalabrasClave.split(',');
                var parametroTemas = req.body.temas;
                var datoTM = parametroTemas.split(',');

                    if(params.autor && params.titulo && params.edicion && params.palabrasClave && params.descripcion && params.temas && params.copias && params.disponibles){
                        libroRevista.categoria = "libro";
                        libroRevista.autor = params.autor;
                        libroRevista.titulo = params.titulo;
                        libroRevista.edicion = params.edicion;
                        libroRevista.descripcion = params.descripcion;
                        libroRevista.copias = params.copias;
                        libroRevista.disponibles = params.disponibles;

                        LibroRevista.find({$or:[
                            {titulo : libroRevista.titulo},
                        ]}).exec((error,existente)=>{
                            if(error) return res.status(500).send({message: 'Error en la peticion de librosRevistas'})
                            if(existente && existente.length>=1){
                                return res.status(500).send({message: 'Libro ya registrado anteriormente'})
                            }
                            libroRevista.save((error,libroGuardado)=>{
                                if(error) return res.status(500).send({message: 'Error al guardar el libro'})
                                if(libroGuardado){
                                    console.log('Libro Guardado con exito')
                                    LibroRevista.findByIdAndUpdate(libroGuardado.id,{$addToSet:{palabrasClave:{palabraClave:datoPC[0]}}},{new:true},(error,palabraGuardada)=>{
                                        if (error) return res.status(404).send({ message: "Error en la peticion de LibroRevista" })
                                        if (!palabraGuardada) return res.status(500).send({ message: "El Libro no se ha encontrado en la base de datos" })
                                        console.log('PalabrasClave guardadas con exito')
                                    })
                                    LibroRevista.findByIdAndUpdate(libroGuardado.id,{$addToSet:{temas:{tema:datoTM[0]}}},{new:true},(error,temaGuardado)=>{
                                        if (error) return res.status(404).send({ message: "Error en la peticion de LibroRevista" })
                                        if (!temaGuardado) return res.status(500).send({ message: "El Libro no se ha encontrado en la base de datos" })
                                        return res.status(200).send({message : 'Libro creado con éxito',temaGuardado})
                                    })
                                }else{
                                res.status(404).send({message : 'No se ha podido guardar el libro'})
                                }
                            })
                        
                        })
                    }else{
                        res.status(200).send({message: 'Rellene los datos necesarios'})
                    }     
                break;
                case 'revista':
                    if(params.autor && params.titulo && params.edicion && params.palabrasClave && params.descripcion && params.temas && params.copias && params.disponibles && params.frecuenciaActual && params.ejemplares){
                        libroRevista.categoria = "revista";
                        libroRevista.autor = params.autor;
                        libroRevista.titulo = params.titulo;
                        libroRevista.edicion = params.edicion;
                        var palabrasClave = params.palabrasClave;
                        libroRevista.descripcion = params.descripcion;
                        var Ptemas = params.temas;
                        libroRevista.copias = params.copias;
                        libroRevista.disponibles = params.disponibles;
                        libroRevista.frecuenciaActual = params.frecuenciaActual;
                        libroRevista.ejemplares = params.ejemplares;

                        LibroRevista.find({$or:[
                            {titulo : libroRevista.titulo},
                        ]}).exec((error,existente)=>{
                            if(error) return res.status(500).send({message: 'Error en la peticion de librosRevistas'})
                            if(existente && existente.length>=1){
                                return res.status(500).send({message: 'Revista ya registrado anteriormente'})
                            }
                            libroRevista.save((error,revistaGuardada)=>{
                                if(error) return res.status(500).send({message: 'Error al guardar la revista'})
                                if(revistaGuardada){
                                    console.log('Revista Guardado con exito')
                                    LibroRevista.findByIdAndUpdate(revistaGuardada.id,{$addToSet:{palabrasClave:{palabraClave:datoPC[0]}}},{new:true},(error,palabraGuardada)=>{
                                        if (error) return res.status(404).send({ message: "Error en la peticion de LibroRevista" })
                                        if (!palabraGuardada) return res.status(500).send({ message: "La revista no se ha encontrado en la base de datos" })
                                        console.log('PalabrasClave guardadas con exito')
                                    })
                                    LibroRevista.findByIdAndUpdate(revistaGuardada.id,{$addToSet:{temas:{tema:datoTM[0]}}},{new:true},(error,temaGuardado)=>{
                                        if (error) return res.status(404).send({ message: "Error en la peticion de LibroRevista" })
                                        if (!temaGuardado) return res.status(500).send({ message: "La revista no se ha encontrado en la base de datos" })
                                        return res.status(200).send({message : 'Revista creada con éxito',temaGuardado})
                                    })
                                }else{
                                res.status(404).send({message : 'No se ha podido guardar el libro'})
                                }
                            })
                        
                        })
                    }else{
                        res.status(200).send({message: 'Rellene los datos necesarios'})
                    }
                break;
                default:
                    return res.status(200).send({message: 'Unicas opciones validas: libro y revista'})
            }
        }else{
            return res.status(500).send({ message: 'El numero de copias no puede ser menor al numero de disponibles'})
        }
    }else{
        return res.status(500).send({ message: 'No tiene los permisos para agregar libros y revistas'})
    }
}
function editarLibroRevista(req,res){
    var idLibroRevista = req.params.libroRevistaId;
    var params = req.body;

    if(rol == req.user.rol){
        LibroRevista.findByIdAndUpdate(idLibroRevista,params,{new:true},(error,libroRevistaActualizado)=>{
            if(error) return res.status(500).send({ message: 'Error en la peticion'})
            if(!libroRevistaActualizado) return res.status(404).send({ message: 'No se ha podido actualizar el libro / revista'})
            if(libroRevistaActualizado) return res.status(200).send({message: 'El libro / revista fue actualizado correctamente',libroRevistaActualizado})
        })
    }else{
        return res.status(500).send({ message: 'No tiene los permisos para modificar este libro/revista'})
    }
}
function eliminarlibroRevista(req,res){
    var idLibroRevista = req.params.libroRevistaId;
    
    if(rol == req.user.rol){
        LibroRevista.findByIdAndDelete(idLibroRevista,(error,libroRevistaEliminado)=>{
            if(error) return res.status(500).send({ message: 'Error en la peticion'})
            if(!libroRevistaEliminado) return res.status(404).send({ message: 'No se ha podido eliminar el libro / revista'})
            if(libroRevistaEliminado) return res.status(200).send({message: 'El libro / revista fue eliminado correctamente',libroRevistaEliminado})
        })
    }else{
        return res.status(200).send({message: 'No tiene los permisos para eliminar libro / revista'})
    }
}
//NO funciona busquedaLibroRevista 6/09/2020
function busquedaLibroRevista(req,res){
    var params = req.body;
    var parametroBuscar = params.parametro;
    var identificadorIngresado = params.identificador;

    if(rol == req.user.rol){
        LibroRevista.find({ parametroBuscar : identificadorIngresado},(error, libroRevistaEncontrado)=>{
            if(error) return res.status(500).send({ message:"Error en la peticion"})
            if(!libroRevistaEncontrado) return res.status(404).send({message: "Libro / Revista no encontrado en la base de datos"})
            if(libroRevistaEncontrado) return res.status(200).send({message: "Libro / Revista encontrado con exito", libroRevistaEncontrado})
        })
    }else{
        return res.status(200).send({message: 'No tiene los permisos para buscar libro / revista'})
    }
}
function prestamoLibroRevista(req,res){
    var libroRevistaPrestar = req.params.libroRevistaId;
    var usuario = req.user.sub;

    if(req.user.rol=="estudiante" || req.user.rol == "catedrático"){
        User.findById(usuario,(error,usuarioEncontrado)=>{
            if(usuarioEncontrado.cantidadDeLibrosPrestado <10){
                LibroRevista.findById(libroRevistaPrestar,(error,libroRevistaEncontrado)=>{
                    if(error) return res.status(500).send({message: "Error en la peticion"})
                    if(!libroRevistaEncontrado) return res.status(404).send({message:"Libro / Revista no encontrado en la base de datos"})
                    if(libroRevistaEncontrado){
                        if(libroRevistaEncontrado.disponibles != 0){
                            User.findByIdAndUpdate(usuario,{$push:{librosRevistasPrestados:{idLibroRevista:libroRevistaEncontrado.id}}},{new:true},(error,libroRevistaPrestado)=>{
                                if(error) return res.status(500).send({message: "Error en la peticion"})
                                if(!libroRevistaPrestado) return res.status(404).send({message:"Usuario no encontrado en la base de datos"})
                                if(libroRevistaPrestado) return res.status(200).send({message:"Libro agregado a su lista de libros prestados"})
                            })
                            User.findByIdAndUpdate(usuario,{$inc:{cantidadDeLibrosPrestado:+1}},{new: true},(error,contadorSumado)=>{
                                if(error) return console.log("Error en la peticion")
                                if(!contadorSumado) return console.log("Usuario no encontrado en la base de datos")
                                if(contadorSumado) return console.log("Cantidad sumada de cantidadDeLibrosPrestado con exito")
                            })
                            LibroRevista.findByIdAndUpdate(libroRevistaPrestar,{$inc:{disponibles:-1}},{new:true},(error,disponibleRestado)=>{
                                if(error) return console.log("Error en la peticion")
                                if(!disponibleRestado) return console.log("Usuario no encontrado en la base de datos")
                                if(disponibleRestado) return console.log("Cantidad restada de disponibles con exito")
                            })
                        }else{
                            return res.status(200).send({message: "Libro / Revista sin disponibles para su prestamo"})
                        }
                    }
                })
            }else{
                return res.status(200).send({message: "Exceso de libros prestados"})
            }
        })
    }else{
        return res.status(200).send({message: "No tiene los permisos para hacer prestamos"})
    }
}
function devolucionLibroRevista(req,res){
    var libroRevistaDevolver = req.params.libroRevistaId;
    var usuario = req.user.sub;

    if(req.user.rol=="estudiante" || req.user.rol == "catedrático"){
        User.findById(usuario,(error,usuarioEncontrado)=>{
            if(error) return res.status(500).send({message: "Error en la peticion de Usuario"})
            if(!usuarioEncontrado) return res.status(404).send({message: "Usuario no encontrado en la base de datos"})
            if(usuarioEncontrado){
                User.findOne({"librosRevistasPrestados.idLibroRevista": libroRevistaDevolver},(error,libroRevistaEncontrado)=>{
                    if(error) return res.status(500).send({message: "Error en la peticion de libroRevista"})
                    if(!libroRevistaEncontrado) return res.status(404).send({message: "Libro / Revista no encontado en la lista de prestamos del usuario"})
                    if(libroRevistaEncontrado){
                        User.findByIdAndUpdate(usuario,{$pull :{librosRevistasPrestados:{idLibroRevista:libroRevistaDevolver}}},(error,libroRevistaEliminadoDePrestamos)=>{
                            if(error) return res.status(500).send({message: "Error en la peticion de Usuario"})
                            if(!libroRevistaEliminadoDePrestamos) return res.status(404).send({message: "Libro/Revista no encontrado en lista de prestamos del usuario"})
                            if(libroRevistaEliminadoDePrestamos) return res.status(200).send({message: "Libro devuelto exitosamente", libroRevistaEliminadoDePrestamos})
                        })
                        User.findByIdAndUpdate(usuario,{$inc:{cantidadDeLibrosPrestado:-1}},{new: true},(error,contadorSumado)=>{
                            if(error) return console.log("Error en la peticion")
                            if(!contadorSumado) return console.log("Usuario no encontrado en la base de datos")
                            if(contadorSumado) return console.log("Cantidad restada de cantidadDeLibrosPrestado con exito")
                        })
                        LibroRevista.findByIdAndUpdate(libroRevistaDevolver,{$inc:{disponibles:+1}},{new:true},(error,disponibleSumado)=>{
                            if(error) return console.log("Error en la peticion")
                            if(!disponibleSumado) return console.log("Libro / Revista no encontrado en la base de datos")
                            if(disponibleSumado) return console.log("Cantidad restada de disponibles con exito")
                        })
                    }
                })
            }
        })
    }else{
        return res.status(200).send({message: "No tiene el permiso para hacer la devolucion"})
    }
}
module.exports={
    addLibroRevista,
    editarLibroRevista,
    eliminarlibroRevista,
    busquedaLibroRevista,
    prestamoLibroRevista,
    devolucionLibroRevista
}