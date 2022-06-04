const jwt = require('jsonwebtoken');

//Crear la funcion de Autenticacion verificacion del token
//==================================
//Verificar Token
//==================================
let verificaToken = (req, res, next) => {
    //leer el header con key token
    let token=req.get('key-token'); //Autorization
    
    jwt.verify(token, process.env.FIRMA, (err, decoded)=>{  //en el decoded esta el payload
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        //  res.json({
        //  token: token
        // });
        req.usuario = decoded.usuario;
        console.log(token);
        //console.log(decoded);
        next();

    });  
};

//==================================
//Verificar AdminRole
//==================================
let verficaAdmin_Role=(req, res, next)=>{
    let usuario=req.usuario;
    if(usuario.role==='ADMIN_ROLE'){
        next();  //pasa al siguinete codigo
    }else{
        res.json({
            ok:false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};

module.exports = {
    verificaToken,
    verficaAdmin_Role
}
