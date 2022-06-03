const jwt = require('jsonwebtoken');

//Crear la funcion de Autenticacion verificacion del token
//Verificar Token
let verificaToken = (req, res, next) => {
    //leer el header con key token
    let token=req.get('key-token'); //Autorization
    

//    res.json({
//         token: token
//     });
    console.log(token);
    next();
   
};

module.exports = {
    verificaToken
}
