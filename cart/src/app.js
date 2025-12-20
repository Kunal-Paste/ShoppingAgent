const express = require('express');
const cartRoute = require('./routes/cart.routes');
const cookieparser = require('cookie-parser')

const app = express();
app.use(express.json());
app.use(cookieparser());


app.use('/api/cart',cartRoute);


module.exports = app;