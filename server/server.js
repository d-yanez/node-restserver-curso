const express = require('express');
const bodyParser = require('body-parser');
require('./config/config'); //load config
const app = express();



//Middleware, controla peticiones (interceptor)
// parse application/x-www-form-urlencoded (processa peticiones)
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/usuarios', function(req, res) {
    let out = {
        mensaje: "Hello World"
    }
    res.json(out);
});

app.post('/usuarios', (req, res) => {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }

});

app.delete('/usuarios', function(req, res) {
    let out = {
        mensaje: "Hello World"
    }
    res.json(out);
});

app.put('/usuarios/:id', function(req, res) {

    let id = req.params.id;
    let out = {
        id
    }
    res.json(out);
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
})