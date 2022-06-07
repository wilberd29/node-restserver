const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const producto = require('../models/producto');


let app = express();
let Producto = require('../models/producto');



// ===========================
//  Obtener productos por termino
// ===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino=req.params.termino;
    let regex=new RegExp(termino, 'i'); //i para case Sensitive expresión regular

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });

    })
});


// ===========================
//  Obtener un producto por ID
// ===========================
app.get('/productos/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    Producto.findById(id)
});


// ===========================
//  Crear un nuevo producto
// ===========================
app.post('/productos', verificaToken, (req, res) => {
    let body=req.body;
    let producto=new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    })

    producto.save((err, productoDB)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
            res.status(201).json({
                ok: true,
                producto: productoDB
            });
        
    });
});


// ===========================
//  Actualizar un producto
// ===========================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 
    let id=req.params.id;
    let body= req.body;

    Producto.findById(id, (err, productoDB)=> {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el Id no existe'
                }
            });
        }

        productoDB.nombre=body.nombre;
        productoDB.precioUni=body.precioUni;
        productoDB.categoria=body.categoria;
        //productoDB.disponible=body.disponible;
        productoDB.descripcion=body.descripcion;
        
        productoDB.save((err, prductoGuardado)=> {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            res.json({
                ok: true,
                producto: prductoGuardado
            });

        });

    })

});


// ===========================
//  Borrar un producto
// ===========================
app.delete('/productos/:id', verificaToken, (req, res) => {

});



module.exports = app;