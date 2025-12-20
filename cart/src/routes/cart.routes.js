const express = require('express');
const middleware = require('../middleware/cart.middleware');

const router = express.Router();

router.post('/items',middleware.authCart(['user']));

module.exports = router;