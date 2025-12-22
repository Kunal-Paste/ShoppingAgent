const {body, validationResult, param} = require('express-validator')
const mongoose = require('mongoose');

function validateResult(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }
    next();
    
}

const validateAddItemToCart = [
    body('productId')
    .isString()
    .withMessage('productId must be sring')
    .custom(value=>mongoose.Types.ObjectId.isValid(value))
    .withMessage('invalid productId format'),

    body('qty')
    .isInt({gt:0})
    .withMessage('quantity must be positive integer'),
    validateResult
]

const validateUpdatedItems = [
    param('productId')
    .isString()
    .withMessage('productId must be string')
    .custom(value=>mongoose.Types.ObjectId.isValid(value))
    .withMessage('invalid productId format'),

    body('qty')
    .isInt({gt:0})
    .withMessage('quantity must be postive integer'),
    validateResult
]

module.exports = {
    validateAddItemToCart,
    validateUpdatedItems
}