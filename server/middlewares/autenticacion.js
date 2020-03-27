const jwt = require('jsonwebtoken');
//================
//Verificar token
//===============


let verificaToken = (req, res, next) => {

    let token = req.get('token'); //lectura de headers
    //validar
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        //ok

        req.usuario = decoded.usuario; //paylod.usuario

        verificaAdminRole(req, res, next);
    });


};

//================
//Verifica ADMIN_ROLE
//===============

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    } else {
        next();
    }

};

module.exports = { verificaToken, verificaAdminRole };