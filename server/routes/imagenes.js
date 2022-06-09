const express = require('express');

const fs=require('fs');
const path=require('path');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:carpeta/:img', verificaToken,  (req, res)=> {
    let carpeta=req.params.carpeta;
    let nombreImagen=req.params.img;

    //let pathImg=`./uploads/${tipo}/${img}`;
    let pathImagen=path.resolve(__dirname, `../../uploads/${carpeta}/${nombreImagen}`); 

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else {

    //path absoluto
    let noImagePath=path.resolve(__dirname, '../assets/no-image.jpg');
    res.sendFile(noImagePath);
    //res.sendfile('./server/assets/no-image.jpg');
    }
})
module.exports=app;