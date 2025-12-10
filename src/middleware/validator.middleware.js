const {body, validationResult} = require('express-validator')

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

module.exports = {
    registerValidations
}