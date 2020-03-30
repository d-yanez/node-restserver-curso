const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');



//==========================
// Obtener productos
//==========================


app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos con el populate (usuario,categoria)
    //paginados


    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .limit(limite)
        .skip(desde)
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({ ok: false, err });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })

            });


        });
});


//==========================
// Obtener producto por ID
//==========================

app.get('/producto/:id', verificaToken, (req, res) => {
    //populate de usuario y categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoDB) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }

                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })


        });


});

//==========================
// Crear un producto
//==========================

app.post('/producto', verificaToken, (req, res) => {
    //grabar el producto
    //grabar una categoria del usuario

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        usuario: req.usuario._id,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {

        //error en BD
        if (err) {
            return res.status(500).json({ ok: false, err });
        }


        res.json({
            ok: true,
            producto: productoDB
        });
    });




});



//==========================
// Actualizat un producto
//==========================

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    //validamos que el producto existsa
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });

        })


    });




});

//==========================
// Borrar un producto
//==========================

app.delete('/producto/:id', verificaToken, (req, res) => {
    //actualizamos solo disponible

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false, new: true }, (err, producto) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto,
            mensaje: 'Producto borrado'
        });

    });

    //otra opcion es 1) findById 2) save. Validando err, !producto


});


//==========================
// Buscar productos
//==========================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //i: insensible

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({ ok: false, err });
            }


            res.json({
                ok: true,
                productos
            });

        });

});


module.exports = app;