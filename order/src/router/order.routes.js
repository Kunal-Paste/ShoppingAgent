const express = require('express');
const middleware = require('../middleware/order.middleware');
const controller = require('../controller/order.controller')

const router = express.Router();

router.post('/',middleware.authOrder(['user']),controller.createOrder)

module.exports = router;