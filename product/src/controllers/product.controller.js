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

async function getProducts(req,res){

    const {q,minprice,maxprice,skip=0,limit=20} = req.query;

    const filter = {};

    if(q){
        filter.$text = {$search:q}
    }

    if(minprice){
        filter['price.amount'] = {...filter['price.amount'], $gte:Number(minprice)}
    }

    if(maxprice){
        filter['price.amount'] = {...filter['price.amount'], $lte:Number(maxprice)}
    }

    const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit)));

    return res.status(200).json({
        data:products
    });

}

async function getProductsById(req,res){
    const {id} = req.params

    const product = await productModel.findById(id);

    if(!product){
        return res.status(404).json({
            message:'product not found'
        })
    }

    return res.status(200).json({
        product:product
    })
}

module.exports = {
    createProduct,
    getProducts,
    getProductsById
}