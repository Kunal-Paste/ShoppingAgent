const express = require('express');
const middleware = require('../middleware/order.middleware')

const router = express.Router();

router.post('/',middleware.authOrder(['user']))

module.exports = router;