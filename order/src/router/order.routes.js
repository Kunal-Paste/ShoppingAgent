const express = require('express');
const middleware = require('../middleware/order.middleware');
const validation = require('../middleware/validation.order');
const controller = require('../controller/order.controller')

const router = express.Router();

router.post('/', middleware.authOrder(['user']), validation.addressValidation, controller.createOrder)

module.exports = router;