const express = require('express');

const app = express();

//invocar GET, POST, PUT, DELETE
app.use(require('./usuario'));
//invocar post login
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;