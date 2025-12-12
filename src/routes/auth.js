const express = require("express");
const router = express.Router();
const authController = require('../controller/auth.controller')
const validtors = require('../middleware/validator.middleware');

router.post("/register", validtors.registerValidations, authController.registerUser);
router.post("/login", validtors.loginValidation, authController.loginUser);

module.exports = router;
