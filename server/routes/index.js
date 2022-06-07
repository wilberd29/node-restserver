const express = require('express');

const app = express();

//invocar GET, POST, PUT, DELETE
app.use(require('./usuario'));
//invocar post login
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));

module.exports = app;