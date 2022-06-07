// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV=process.env.NODE_ENV || 'dev';

//BD Servidor url local y cloud
let urlDB;
 if(process.env.NODE_ENV==='dev') {
     urlDB="mongodb://localhost:27017/cafe"
 }else{
     //urlDB="mongodb+srv://wilberd29:wilutp19@cluster0.tx8fy.mongodb.net/cafe"
     urlDB=process.env.MONGO_URI;
}

process.env.URLlDB=urlDB;

//vencimiento del token o fecha de expiracion
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN='48h'; //60 * 60 * 24 * 30; 1 mes

//palabra clave o Firma
process.env.FIRMA= process.env.FIRMA || 'secret-demo';

//Google client Id
process.env.CLIENT_ID=process.env.CLIENT_ID || '339317350182-0c86k9gallaag2p69ltsrcdl1l22fuh3.apps.googleusercontent.com';
