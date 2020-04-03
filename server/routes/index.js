const express = require('express');
const app = express();

app.use(require('./usuario')); //importamos y usamos rutas de usuarios
app.use(require('./login')); //importamos y usamos rutas de usuarios
app.use(require('./categoria')); //importamos y usamos rutas de categorias
app.use(require('./producto')); //importamos y usamos rutas de producto
app.use(require('./upload')); //importamos y usamos rutas para subida de archivos
app.use(require('./imagenes')); //importamos y usamos rutas para subida de archivos

module.exports = app;