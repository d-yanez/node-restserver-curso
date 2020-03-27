const express = require('express');
const Usuario = require('../models/usuario'); //nomeclatura
const bcrypt = require('bcrypt');
const _ = require('underscore'); //"_" es estandar

const app = express();

app.get('/usuario', function(req, res) { //trae registros activos


    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img') // con ello indicamos que campos enviar de cada objeto
        .skip(desde) //desde x registos
        .limit(limite) //cantidad
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })

            });

        });
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });


});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { //Borrado desde la BD

    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }
        if (!usuarioBorrado) {
            return res.json({
                ok: true,
                err: {
                    message: 'Usuario no encontrado'
                }

            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    });

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //filtra y crear un objeto
    //opcion de limpiar campos pero al ser demasiados user underscore.js (.pick)
    //delete body.password;
    //delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate//
        //runValidators: para ejecutar validaciones de objecto en schema
        if (err) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });


});

module.exports = app;