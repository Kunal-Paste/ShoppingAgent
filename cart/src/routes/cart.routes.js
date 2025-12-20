const express = require('express');
const middleware = require('../middleware/cart.middleware');
const validation = require('../middleware/validation.middleware');
const controller = require('../controllers/cart.controllers')

const router = express.Router();

router.post('/items',validation.validateAddItemToCart,middleware.authCart(['user']),controller.addItemsToCart);

module.exports = router;