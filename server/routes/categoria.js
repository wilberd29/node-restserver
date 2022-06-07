const express=require('express');
const { verificaToken, verficaAdmin_Role }=require('../middlewares/autenticacion');
let app=express();
let Categoria=require('../models/categoria');

//Mostrar todas las categorias
app.get('/categoria', (req, res)=> {
    Categoria.find({})
    .populate('usuario', 'nombre email')
    .exec((err, categorias)=> {
        if(err) {
            return res.status(500). json({
                ok:false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        })
    })
});

//Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res)=> {
    
    let id = req.params.id;
    
    Categoria.findById(id, (err, categoriaDB)=> {
    
        if(err) {
            return res.status(500). json({
                ok:false,
                err
            });
        }

        if(!categoriaDB) {
            return res.status(400). json({
                ok:false,
                err: {
                    message: 'El Id nos es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
});

//Crear nueva categoria
app.post('/categoria', verificaToken, (req, res)=> {
    let body=req.body;
    let categoria=new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    
    categoria.save((err, categoriaDB)=> {
        if(err) {
            return res.status(500). json({
                ok:false,
                err
            });
        }

        if(!categoriaDB) {
            return res.status(400). json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });
    });
});


app.put('/categoria/:id', verificaToken, (req, res)=> {
    
    let id=req.params.id;
    let body = req.body;
    let descCategoria= {
        descripcion: body.descripcion
    } 

    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {

        if(err) {
            console.log(err);
            return res.status(500). json({
                ok:false,
                err
            });
        }

        if(!categoriaDB) {
            console.log(err);
            return res.status(400). json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });


    })

});

app.delete('/categoria/:id', [verificaToken, verficaAdmin_Role], (req, res)=> {
    //Solo un administrador puede borrar la categoria sno eliminar si nom marcar
    let id=req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB)=>{

        if(err) {
            console.log(err);
            return res.status(500). json({
                ok:false,
                err
            });
        }

        if(!categoriaDB) {
            console.log(err);
            return res.status(400). json({
                ok:false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    })
});

module.exports = app;