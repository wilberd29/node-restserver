require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Configurar global de rutas usuario y login
//invocar GET, POST, PUT, DELETE
//app.use(require('./routes/usuario'));
//invocar post login
//app.use(require('./routes/login'));
app.use(require('./routes/index'));

//Fin Configurar global de rutas

main().catch(err => console.log(err));
async function main() {
  
  //await mongoose.connect('mongodb://localhost:27017/cafe');
  await mongoose.connect(process.env.URLlDB);
    console.log('Base de datos ONLINE');
  }

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});