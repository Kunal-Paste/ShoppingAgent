const express = require('express');
const cookieparser = require('cookie-parser');
const paymentRoute = require('./routes/payment.routes');

const app = express();

app.use(cookieparser());
app.use(express.json());

app.use('/api/payments', paymentRoute);

module.exports = app;