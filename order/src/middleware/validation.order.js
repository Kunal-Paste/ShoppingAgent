const {body, validationResult} = require('express-validator');

const respondWithValidationErrors = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }
    next();
}


const addressValidation = [
    body('shippingAddress.street')
    .isString()
    .withMessage('street must be string')
    .notEmpty()
    .withMessage('street is required'),

    body('shippingAddress.city')
    .isString()
    .withMessage('city must be string')
    .notEmpty()
    .withMessage('city is required'),

    body('shippingAddress.state')
    .isString()
    .withMessage('state must be string')
    .notEmpty()
    .withMessage('state is required'),

    body('shippingAddress.pincode')
    .isString()
    .withMessage('pincode must be string')
    .notEmpty()
    .withMessage('pincode is required'),

    body('shippingAddress.country')
    .isString()
    .withMessage('country must be string')
    .notEmpty()
    .withMessage('country is required'),
    respondWithValidationErrors
]

module.exports = {
    addressValidation
}