const express = require("express");
const router = express.Router();
const authController = require('../controller/auth.controller')
const validtors = require('../middleware/validator.middleware');
const middleware = require('../middleware/auth.middleware')

router.post("/register", validtors.registerValidations, authController.registerUser);
router.post("/login", validtors.loginValidation, authController.loginUser);
router.get('/me', middleware.authMiddleware, authController.getcurrentUser);
router.get('/logout',authController.logoutUser);
// will be continuoing tommorrow

module.exports = router;
