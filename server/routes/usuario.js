const express = require('express');
const bcrypt=require('bcrypt');
const _=require('underscore');

const { response } = require('express');
const Usuario = require('../models/usuario');

//para obtener el middlewares Autenticacion verifica Token
const { verificaToken,  verficaAdmin_Role }=require('../middlewares/autenticacion');

const app = express();

//Obener listado de usuarios
app.get('/usuario', verificaToken, (req, res) => {
    //res.json('get Usuario LOCAL!!!');

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // })

    let Estado = {
        estado: true
    };

    let desde=req.query.desde || 0;
    desde=Number(desde);
    let pagina=req.query.pagina || 5;
    pagina=Number(pagina);

    //Usuario.find({role:'ADMIN_ROLE'}, 'nombre role') //Filtra y solo campos a mostrar
    Usuario.find({estado: true}, 'nombre role') //Filtra por estado Activo
        .skip(desde)
        .limit(pagina)
        .exec((err, usuarioDB)=>{
            if (err) {
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            
            //Contar registros
            //Usuario.count({role:'ADMIN_ROLE'}, (err, conteo)=>{
            Usuario.count({estado: true}, (err, conteo)=>{

                res.json({
                    ok: true,
                    usuarioDB,
                    conteo
                })
            })

        })
});

app.post('/usuario', [verificaToken, verficaAdmin_Role], function(req, res) {

    let body = req.body;
    let usuario=new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB)=> {
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }
        
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});


app.put('/usuario/:id', [verificaToken, verficaAdmin_Role], function(req, res) {

    let id = req.params.id;
    //let body= req.body;

    let body=_.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    //antes de la actualizacion
    //delete body.password;
    //delete body.google;


    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    } )

});


app.delete('/usuario/:id', [verificaToken, verficaAdmin_Role], function(req, res) {
    //res.json('delete Usuario');
    let id=req.params.id;

    let cambiaEstado = {
        estado: false
    };
    //usuario.findByIdAndRemove(id, (err, usuarioDB)=>{
    //Marcar antes de eliminar campo estado
    usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioDB)=>{
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

module.exports=app;