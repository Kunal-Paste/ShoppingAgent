const express = require('express');
const middleware = require('../middleware/payment.middleware');
const controller = require('../controller/payment.controller')

const router = express.Router();

router.post('/create/:orderId', middleware.authPayment(['user','seller']), controller.createPayment);
router.post('/verify', middleware.authPayment(['user','seller']), controller.verifyPayment);

module.exports = router;