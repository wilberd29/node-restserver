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