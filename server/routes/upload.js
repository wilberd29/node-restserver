const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario=require('../models/usuario');
const Producto = require('../models/producto');
const fs=require('fs');
const path=require('path');

const app = express();

app.use(fileUpload());

app.put('/upload/:carpeta/:id', (req, res)=> {
    
    let carpeta=req.params.carpeta;
    let id=req.params.id;

    if(!req.files) {
    return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //valida folder a guardar si es usuario y productos
    console.log(carpeta);
    let tiposValidos=['productos', 'usuarios'];
    if (tiposValidos.indexOf(carpeta)< 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }
 

    let archivo=req.files.archivo;  //obtiene el archivo
    console.log(archivo);           // the uploaded file object

    //Validar extensiones validas permitidas
    let ExtensioneValidas=['png', 'jpg', 'gif','jpeg'];
    let nombreArchivo=archivo.name.split('.');
    let extension=nombreArchivo[nombreArchivo.length-1];
    console.log(extension); 
    if (ExtensioneValidas.indexOf(extension)<0) {
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Las extensiones permitidas son ' + ExtensioneValidas.join(', ')
            }
        });
    }
    
    
    //cambiando el nombre al archivo
    let nombreArchivoCambiado=`${archivo.name}_${new Date().getMilliseconds()}.${extension}`;
    console.log(nombreArchivoCambiado);   

    //archivo.mv(`uploads/${carpeta}/${archivo.name}`, (err)=>{
    archivo.mv(`uploads/${carpeta}/${nombreArchivoCambiado}`, (err)=>{
        
        if(err)
            return res.status(500).json({
                ok: false,
                err
                });

        //res.send('Archivo subido');
        //Grabar en base datos
        if(carpeta==='usuarios') {
            imagenUsuario(id, res, nombreArchivoCambiado, carpeta)
        }else{
            imagenProducto(id, res, nombreArchivoCambiado, carpeta);
        }
        
        // res.json({
        //     ok: true,
        //     message: 'Archivo subido correctamente'
        // })
        
    });
    //limits: { fileSize: 50 * 1024 * 1024 },
  });

  //Grabar en base de datos
  function imagenUsuario(id, res, nombreArchivoCambiado, carpeta){
    Usuario.findById(id, (err, usuarioDB)=>{

        if(err) {
            BorrarArchivo(nombreArchivoCambiado, carpeta);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB) {
            BorrarArchivo(nombreArchivoCambiado, carpeta);
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no existe'}
            });
        }

        //Borrar imagen existente un unico archivo
        BorrarArchivo(usuarioDB.img, carpeta);

        usuarioDB.img=nombreArchivoCambiado;

        usuarioDB.save((err, usuarioGuardado)=>{
            return res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivoCambiado
            });
        })

        //

    })
  }

  function imagenProducto(id, res, nombreArchivoCambiado, carpeta){
        Producto.findById(id, (err, productoDB)=>{
    
            if(err) {
                BorrarArchivo(nombreArchivoCambiado, carpeta);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if(!productoDB) {
                BorrarArchivo(nombreArchivoCambiado, carpeta);
                return res.status(400).json({
                    ok: false,
                    err: { message: 'Producto no existe'}
                });
            }
    
            //Borrar imagen existente un unico archivo
            BorrarArchivo(productoDB.img, carpeta);
    
            productoDB.img=nombreArchivoCambiado;
    
            productoDB.save((err, productoGuardado)=>{
                return res.status(200).json({
                    ok: true,
                    producto: productoGuardado,
                    img: nombreArchivoCambiado
                });
            })
    
            //
    
        })
  }


    function BorrarArchivo(nombreImagen, Carpeta){
        let pathImagen=path.resolve(__dirname, `../../uploads/${Carpeta}/${nombreImagen}`); 
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

  module.exports=app;