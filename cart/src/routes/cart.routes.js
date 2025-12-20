const express = require('express');
const middleware = require('../middleware/cart.middleware');
const validation = require('../middleware/validation.middleware');
const controller = require('../controllers/cart.controllers')

const router = express.Router();

router.post('/items',validation.validateAddItemToCart,middleware.authCart(['user']), controller.addItemsToCart);
router.patch('/items/:productId', validation.validateUpdatedItems, middleware.authCart(['user']), controller.updateCartItems);
router.get('/', middleware.authCart(['user']), controller.getCart);

module.exports = router;