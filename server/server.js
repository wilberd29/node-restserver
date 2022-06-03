require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//invocar GET, POST, PUT, DELETE
app.use(require('./routes/usuario'));

main().catch(err => console.log(err));
async function main() {
  
  //await mongoose.connect('mongodb://localhost:27017/cafe');
  await mongoose.connect(process.env.URLlDB);
    console.log('Base de datos ONLINE')
  }

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});