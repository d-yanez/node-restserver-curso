const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

//middleware
app.use(fileUpload()); // transforma lo que este subiendo y deja en req.files


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({ ok: false, err: { message: 'Las tipos permitidos son: ' + tiposValidos.join(', ') } });
    }

    let archivo = req.files.archivo; //"archivo" es nombre del input.file
    //extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({ ok: false, err: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', '), ext: extension } });
    }

    //Cambiar nombre del archivos
    let nombreArchivoGuardar = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivoGuardar}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, err });


        //res.json({ ok: true, message: 'Imagen subida correctamente!' });
        //aqui imagen cargada
        if (tipo === 'productos') {

            imagenProducto(id, res, nombreArchivoGuardar);
        } else {
            imagenUsuario(id, res, nombreArchivoGuardar);
        }



    });





});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });


        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios'); //evitar completar servidor de basura
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        //validamos si existe en servef


        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });


        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos'); //evitar completar servidor de basura
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }
        //validamos si existe en servef


        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });

    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;