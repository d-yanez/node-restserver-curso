const express = require('express');
const app = express();

app.use(require('./usuario')); //importamos y usamos rutas de usuarios
app.use(require('./login')); //importamos y usamos rutas de usuarios

module.exports = app;