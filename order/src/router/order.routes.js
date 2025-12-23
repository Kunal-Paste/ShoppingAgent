const express = require('express');
const middleware = require('../middleware/order.middleware');
const validation = require('../middleware/validation.order');
const controller = require('../controller/order.controller')

const router = express.Router();

router.post('/', middleware.authOrder(['user']), validation.addressValidation, controller.createOrder);
router.get('/me',middleware.authOrder(['user']), controller.getMyOrder);
router.get('/:id',middleware.authOrder(['user','seller']), controller.getOrderById);

module.exports = router;