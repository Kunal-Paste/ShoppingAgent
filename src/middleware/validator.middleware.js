const {body, validationResult} = require('express-validator');
const { errors } = require('mongodb-memory-server');

const respondWithValidationErrors = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }
    next();
}

const registerValidations = [
    body("username")
    .isString()
    .withMessage("username must be a string")
    .isLength({min:3})
    .withMessage("username must be atleast 3 character long"),

    body("email")
    .isEmail()
    .withMessage("invalid email address"),

    body("password")
    .isLength({min:6})
    .withMessage("password must be atleast 3 character long"),

    body("fullName.firstName")
    .isString()
    .withMessage("first name must be string")
    .notEmpty()
    .withMessage("first name is required"),


    body("fullName.lastName")
    .isString()
    .withMessage("last name must be string")
    .notEmpty()
    .withMessage("last name is required"),

    respondWithValidationErrors
]

const loginValidation = [
    body('email')
    .optional()
    .isEmail()
    .withMessage('invalid email address'),

    body('username')
    .optional()
    .isString()
    .withMessage('username must be string'),

    body('password')
    .isLength({min:6})
    .withMessage('passowrd must be atleast 6 character long'),

    (req,res,next) => {
        if(!req.body.email && !req.body.username){
            return res.status(400).json({errors: [{message:'either email or username is required'}]});
        }
        respondWithValidationErrors(req,res,next);
    }
]

module.exports = {
    registerValidations,
    loginValidation
}