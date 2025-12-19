const { default: mongoose } = require('mongoose');
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

async function updateProducts(req,res){

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            message:'invalid product id'
        })
    }

    const product = await productModel.findOne({
        _id:id,
    })

    if(!product){
        return res.status(404).json({
            message:'product not found'
        })
    }

    if(product.seller.toString() !== req.user.id){
        return res.status(403).json({
            message:'forbidden: you can only update your product'
        })
    }

    const allowedUpdates = ['title','description','price'];

    for(const key of Object.keys(req.body)){
        if(allowedUpdates.includes(key)){

            if(key==='price' && typeof req.body.price === 'object'){

                if(req.body.price.amount !== undefined){
                    product.price.amount = Number(req.body.price.amount)
                }

                if(req.body.price.currency !== undefined){
                    product.price.currency = req.body.price.currency
                }

            } else {
                product[key] = req.body[key];
            }
        }
    }

    await product.save();

    return res.status(200).json({
        message:'product updated successfully',
        product
    })

}

async function deleteProducts(req,res){

    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            message:'invalid products id'
        })
    }

    const product = await productModel.findOne({
        _id:id,
    })

    if(!product){
        return res.status(404).json({
            message:'product not found'
        })
    }

    if(product.seller.toString() !== req.user.id){
        return res.status(403).json({
            message:'forbidden: you can only delete your product'
        })
    }

    await productModel.findOneAndUpdate({_id:id});
    
    return res.status(200).json({
        message:'product deleted successfully'
    })

}

async function getProductsBySeller(req,res){
    
    const seller = req.user

    const {skip=0, limit=20} = req.query;

    const products = await productModel.find({seller:seller.id}).skip(skip).limit(Math.min(limit, 20));

    return res.status(200).json({
        data:products
    })

}

module.exports = {
    createProduct,
    getProducts,
    getProductsById,
    updateProducts,
    deleteProducts,
    getProductsBySeller
}