const express = require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

//==================================================================================================================
//libreria google 
//==================================================================================================================
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario=require('../models/usuario');
const usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res)=> {
    
    //Obtener el body
    let body=req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB) {
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'Usuario o contraseña incorrectos'
                    }
                });
            }

        //Desencriptar igualar
        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token=jwt.sign({
                usuario: usuarioDB    //payload
                }, process.env.FIRMA, //firma
                { expiresIn: process.env.CADUCIDAD_TOKEN });    //expira en 1 hora, 30 dias

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
            })

        })
    
});

//==================================================================================================================00
//Configuracion con google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //    const userid = payload['sub'];      //obtener datos del usuario
    //console.log(payload.name);
    //console.log(payload.email);
    //console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }
  


app.post('/google', async(req, res)=> {
    let token=req.body.idtoken;  //obtiene el token del body

    let googleUser= await verify(token)
        .catch(e => {
                return res.status(403).json({
                    ok: false,
                    err: e
                });
        });

        //validar contra la BD user google y mongoDB
        Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{

        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        };

        //si se autentico
        if (usuarioDB) {    //existe en la base de datos mongo
            if (usuarioDB.google===false) {  //no se autentico por google
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'Debe de usar la autenticacion normal'
                        }
                });
            } else {
                    let token=jwt.sign({
                    usuario: usuarioDB    //payload
                    }, process.env.FIRMA, //firma
                        { expiresIn: process.env.CADUCIDAD_TOKEN });   

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token   //token nuevo
                    });
            }
        }  else {
            //si el usuario no existe en nuestra BD mongo
            let usuario =new Usuario();
            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img=googleUser.img;
            usuario.google=true;
            usuario.password=':)'; //solo para pasar es obligatorio

            usuario.save((err, usuarioDB)=>{
                if (err) {
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                };
            
                let token=jwt.sign({
                    usuario: usuarioDB    //payload
                }, process.env.FIRMA, //firma
                    { expiresIn: process.env.CADUCIDAD_TOKEN });   

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token   //token nuevo
                });
                
            });
        }
       
        //  res.json({
        //      uuario: googleUser
        //  })
    });

});



module.exports=app;