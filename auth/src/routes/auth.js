const express = require("express");
const router = express.Router();
const authController = require('../controller/auth.controller')
const validtors = require('../middleware/validator.middleware');
const middleware = require('../middleware/auth.middleware')

router.post("/register", validtors.registerValidations, authController.registerUser);
router.post("/login", validtors.loginValidation, authController.loginUser);
router.get('/me', middleware.authMiddleware, authController.getcurrentUser);
router.get('/logout',authController.logoutUser);

router.post('/user/me/addresses', validtors.addressValidation, middleware.authMiddleware, authController.addUserAddress);
router.get('/user/me/addresses', middleware.authMiddleware, authController.getUserAddress );
router.delete('/user/me/addresses/:addressId', middleware.authMiddleware, authController.deleteUserAddress);

module.exports = router;
