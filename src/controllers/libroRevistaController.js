'use strict'

//IMPORTS
var bcrypt = require("bcrypt-nodejs"); 
var LibroRevista = require('../models/libroRevista');
var jwt = require('../services/jwt');
var path = require("path");
var fs = require('fs');
const rol = "admin";

function addLibroRevista(req,res){
    var libro_o_Revista = req.params.decision;
    var libroRevista = new LibroRevista();
    var params = req.body;
    
    if(rol == req.user.rol){
        switch (libro_o_Revista) {
            case 'libro':

                

                if(params.autor && params.titulo && params.edicion && params.palabrasClave && params.descripcion && params.temas && params.copias && params.disponibles){
                    libroRevista.categoria = "libro";
                    libroRevista.autor = params.autor;
                    libroRevista.titulo = params.titulo;
                    libroRevista.edicion = params.edicion;
                    var palabrasClave = params.palabrasClave;
                    libroRevista.descripcion = params.descripcion;
                    var Ptemas = params.temas;
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
                                LibroRevista.findByIdAndUpdate(libroGuardado.id,{$addToSet:{palabrasClave:{palabraClave:palabrasClave}}},{new:true},(error,palabraGuardada)=>{
                                    if (error) return res.status(404).send({ message: "Error en la peticion de LibroRevista" })
                                    if (!palabraGuardada) return res.status(500).send({ message: "El Libro no se ha encontrado en la base de datos" })
                                    console.log('PalabrasClave guardadas con exito')
                                })
                                LibroRevista.findByIdAndUpdate(libroGuardado.id,{$addToSet:{temas:{tema:Ptemas}}},{new:true},(error,temaGuardado)=>{
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
                                LibroRevista.findByIdAndUpdate(revistaGuardada.id,{$addToSet:{palabrasClave:{palabraClave:palabrasClave}}},{new:true},(error,palabraGuardada)=>{
                                    if (error) return res.status(404).send({ message: "Error en la peticion de LibroRevista" })
                                    if (!palabraGuardada) return res.status(500).send({ message: "La revista no se ha encontrado en la base de datos" })
                                    console.log('PalabrasClave guardadas con exito')
                                })
                                LibroRevista.findByIdAndUpdate(revistaGuardada.id,{$addToSet:{temas:{tema:Ptemas}}},{new:true},(error,temaGuardado)=>{
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
        return res.status(500).send({ message: 'No tiene los permisos para agregar libros y revistas'})
    }
}


module.exports={
    addLibroRevista
}