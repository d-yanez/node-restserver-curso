const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


require('./config/config'); //load config
const app = express();



//Middleware, controla peticiones (interceptor)
// parse application/x-www-form-urlencoded (processa peticiones)
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//Configuración global de rutas
app.use(require('./routes/index')); //agrupamos rutas

//hacer carpeta publica
app.use(express.static(path.resolve(__dirname, '../public')));

//mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },
    (err, res) => {
        if (err)
            throw err;
        console.log('Base de datos online');


    });


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
})