const {body, validationResult} = require('express-validator');

function handleValidationError(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            message:'validation error',
            errors
        })
    }
    next();
}

const productValidator = [
    body('title')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('title is required'),

    body('description')
    .optional()
    .isString()
    .withMessage('description must be string')
    .trim()
    .isLength({max:500})
    .withMessage('description max length is 500'),

    body('priceAmount')
    .notEmpty()
    .withMessage('price amount is required')
    .bail()
    .isFloat({gt:0})
    .withMessage('price amount must be a number > 0'),

    body('priceCurrency')
    .optional()
    .isIn(['USD','INR'])
    .withMessage('priceCurrency must be USD or INR'),
    handleValidationError
    
]

module.exports = {
    productValidator
}