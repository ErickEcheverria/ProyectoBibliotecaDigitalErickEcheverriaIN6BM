'use strict'

//IMPORTS
var bcrypt = require("bcrypt-nodejs"); 
var User = require('../models/user');
var jwt = require('../services/jwt');
var path = require("path");
var fs = require('fs');

// Variable creada para crear el usuario "admin"
var addAdmin = 1;
if(addAdmin== 1){
    var user = new User();
    user.nombre = 'admin';
    user.rol = 'admin';
    user.password ='admin';

    User.find({ $or: [
        { nombre: user.nombre},
        ]}).exec((error, users)=>{
            if(error) return console.log('Error en la peticion de usuarios')

            if(users && users.length >=1){
            return console.log('El Admin ya ha sido creado')
            }else{bcrypt.hash(user.password, null, null, (error, hash)=>{
            user.password = hash;
            
            user.save((error, usuarioGuardado)=>{
                if(error) return console.log('Error al guardar el usuario')
                if(usuarioGuardado){
                    console.log('Admin creado con éxito')
                }else{
                    console.log('No se ha podido guardar el admin')
                }
            })
        })
        }
    })
}else{
    res.status(200).send({message: 'Rellene los datos necesarios'})
}
// Funcion para añadir usuarios
function addUsuario(req, res){
    var user = new User();
    var params = req.body;
    var rol = "admin";

    if(rol ==req.user.rol){
        if(params.rol == "estudiante" || params.rol =="catedrático"){
            if(params.usuario && params.carnet && params.nombre && params.apellido && params.rol && params.password){
                user.usuario = params.usuario;
                user.carnet = params.carnet;
                user.cui = params.cui;
                user.nombre =params.nombre;
                user.apellido = params.apellido;
                user.rol = params.rol;
                user.password =params.password;

                User.find({ $or: [
                    { usuario: user.usuario},
                    { cui : user.cui},
                    {carnet: user.carnet}
                    ]}).exec((error, users)=>{
                        if(error) return res.status(500).send({ message: 'Error en la peticion de usuarios' })
                        if(users && users.length >=1){
                        return res.status(500).send({ message: 'Usuario ya registrado anteriormente en la base de datos'})
                        }else{bcrypt.hash(params.password, null, null, (error, hash)=>{
                        user.password = hash;
                        
                        user.save((error, usuarioGuardado)=>{
                            if(error) return res.status(500).send({message: 'Error al guardar el usuario'})
                            if(usuarioGuardado){
                            res.status(200).send({usuarioGuardado : "Usuario creado con éxito"})
                            }else{
                            res.status(404).send({message : 'No se ha podido guardar usuario'})
                            }
                        })
                    })
                }
            })
        }else{
            res.status(200).send({message: 'Rellene los datos necesarios'})
        }
    }else{
        return res.status(500).send({ message: 'Rol ingresado no permitido Admitidos únicamente: estudiante, catedrático'})
    }
}else{
    return res.status(500).send({ message: 'No tiene los permisos para actualizar este usuario'})
}

}
function loginUsuario(req, res){
    var params = req.body;

    User.findOne({nombre: params.nombre},(error,user)=>{
        if(error) return res.status(500).send({message: 'Error'})
        
        if(user){
            bcrypt.compare(params.password, user.password, (error,check)=>{
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }else{
                        user.password = undefined;
                        return res.status(200).send({ user })
                    }
                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido registrar'})
                }
            })
        }else{
            return res.status(404).send({message: 'El usuario no se ha podido loguear'})
        }
    })
}
module.exports={
    addUsuario,
    loginUsuario
}