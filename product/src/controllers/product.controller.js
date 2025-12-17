const productModel = require('../model/product.model');
const {uploadImage} = require('../services/imagekit.service');

async function createProduct(req,res){
    try {
        
        const {title,description,priceAmount,priceCurrency='INR'} = req.body;

        if(!title || !priceAmount){
            return res.status(400).json({
                message:'title and priceamount is required'
            })
        }

        const seller = req.user.id;

        const price = {
            amount:Number(priceAmount),
            currency:priceCurrency
        }

        const images = await Promise.all((req.files || []).map(file => uploadImage({buffer:file.buffer})));

        const product = await productModel.create({title,description,price,seller,images});

        return res.status(201).json({
           message:'product created successfully',
           data:product
        })

    } catch (error) {
        console.error('create product error',error);
        return res.status(500).json({
            message:'internal server error'
        });
    }
}

module.exports = {
    createProduct
}