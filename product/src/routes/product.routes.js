const express = require('express');
const middleware = require('../middleware/product.middleware')


const router = express.Router();

router.post("/",middleware.authProduct(['admin','seller']))