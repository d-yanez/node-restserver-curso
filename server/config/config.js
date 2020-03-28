//===============
// Puerto
//===============

process.env.PORT = process.env.PORT || 4200;

//===============
// Entorno
//===============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============
// Base de datos
//===============

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;


//===============
// Fecha de vencimiento de Token
//===============
//60 segundos
//60 minutos
//24 horas
//30 días

process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || 60 * 60 * 24 * 30;



//===============
// SEDD de autenticación
//===============

process.env.SEED = process.env.SEED || 'secret';


//===============
// Google Client ID
//===============
process.env.CLIENT_ID = process.env.CLIENT_ID || '10723481191-2fb5p0vq93qqlsclo1ejc7iuk7b3uio7.apps.googleusercontent.com';