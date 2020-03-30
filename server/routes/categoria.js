const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//==========================
// Mostrar todas las categorias
//==========================

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') ////Primer arg. es para ObjectId, 2do. arg. es para indicar los campos al devolver el objeto 'usuario'cargar informacion de objectID
        .exec((err, categorias) => { //si se requiere otro esquema se agrega otro .populate

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias

            });

        });

});


//==========================
// Mostrar  una categoria por ID
//==========================

app.get('/categoria/:id', verificaToken, (req, res) => {


    let id = req.params.id;

    Categoria.findById(id) //se deja vacio para traer objeto conpleto por Types.ObjectId
        .populate('usuario')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }
            if (!categoriaDB) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }

                })
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            })

        });

});


//==========================
// Crear neuva categoria
//==========================

app.post('/categoria', verificaToken, (req, res) => {
    // regresa una nueva categoría
    //req.usuario_id

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id

    });

    categoria.save((err, categoriaDB) => {
        //error en BD
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        //porque no se creo la categoria
        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//==========================
// Actualiza  categoria
//==========================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let desCategoria = {
        descripcion: req.body.descripcion
    }

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true }, (err, categoriaDB) => { //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate//
        //runValidators: para ejecutar validaciones de objecto en schema
        //error en BD
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        //porque no se creo la categoria
        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});


//==========================
// Borrado  categoria
//==========================

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        //porque no se creo la categoria
        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });

    });


});


module.exports = app;