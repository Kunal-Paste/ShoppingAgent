const express = require('express');
const cookieparser = require('cookie-parser');
const orderRoute = require('./router/order.routes')

const app = express();
app.use(express.json());
app.use(cookieparser());

app.use('/api/order', orderRoute);

module.exports = app;