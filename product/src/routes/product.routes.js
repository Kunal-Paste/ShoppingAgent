const express = require('express');
const middleware = require('../middleware/product.middleware');
const validator = require('../middleware/validator.middleware')
const multer = require('multer');
const controller = require('../controllers/product.controller');

const upload = multer({storage:multer.memoryStorage()});
const router = express.Router();

router.post("/", middleware.authProduct(['admin','seller','user']), upload.array('images',5), validator.productValidator, controller.createProduct);
router.get("/seller",middleware.authProduct(["seller"]),controller.getProductsBySeller);
router.get("/", controller.getProducts);
router.patch("/:id",middleware.authProduct(["seller"]), controller.updateProducts);
router.delete("/:id",middleware.authProduct(["seller"]), controller.deleteProducts);

router.get("/:id", controller.getProductsById);

module.exports = router;