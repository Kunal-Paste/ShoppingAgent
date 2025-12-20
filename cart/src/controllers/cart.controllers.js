const cartModel = require('../model/cart.model');

async function addItemsToCart(req,res){
    const {productId,qty} = req.body;

    const user = req.user;

    let cart = await cartModel.findOne({user:user._id});

    if(!cart){
        cart = new cartModel({user:user._id,items:[]});
    }

    const existingItemIndex = cart.items.findIndex(items=>items.productId.toString() === productId);

    if(existingItemIndex>=0){
        cart.items[existingItemIndex].quantity += qty
    }else{
        cart.items.push({productId, quantity:qty});
    }

    await cart.save();

    return res.status(200).json({
        message:'item added to cart successfully',
        cart
    })

}

module.exports = {
    addItemsToCart
}