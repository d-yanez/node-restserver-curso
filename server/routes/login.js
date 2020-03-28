const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario'); //nomeclatura
const app = express();


app.post('/login', (req, res) => {


    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => { //si existe correo válido

        if (err) {

            return res.status(500).json({ ok: false, err });
        }

        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });

        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }

        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //expira en 30 dias

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        }); // se guarda en localStorage y dejar para proximas peticiones

    });



});



//Configuraciones de google

//let verify = async(token) => {
async function verify(token) { //regresa una promoesa
    //async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audiance: process.env.CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}
//verify(token).catch(console.error);

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;
    let googleUser = await verify(token) //ya que al ser async(la fx verify) devuelve una promesa
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        });
    //verify(token).catch(err => { console.log(err); })

    // res.json({
    //     usuario: googleUser
    // })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                });
            } else {
                let tokenPersonalizado = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //expira en 30 dias
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: tokenPersonalizado
                })

            }
        } else {
            //si el usuario no existe en nuestra BD


            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = bcrypt.hashSync('password', 10); //para pasar la validacion de la BD

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let tokenPersonalizado = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //expira en 30 dias
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: tokenPersonalizado
                })

            });


        }

    });

});


module.exports = app;