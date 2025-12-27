const express = require('express');
const cookieparser = require('cookie-parser')

const app = express();

app.use(cookieparser());
app.use(express.json());

module.exports = app;