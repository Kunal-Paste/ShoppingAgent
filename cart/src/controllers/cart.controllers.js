const cartModel = require('../model/cart.model');

async function addItemsToCart(req,res){
    const {productId,qty} = req.body;

    const user = req.user;

    let cart = await cartModel.findOne({user:user.id});

    if(!cart){
        cart = new cartModel({user:user.id,items:[]});
    }

    const existingItemIndex = cart.items.findIndex(items=>items.productId.toString() === productId);

    if(existingItemIndex>=0){
        cart.items[existingItemIndex].quantity += qty
    }else{
        cart.items.push({productId, quantity:qty});
    }

    await cart.save();

    console.log('cart (addItemsToCart):', cart);

    return res.status(200).json({
        message:'item added to cart successfully',
        cart
    })

}

async function updateCartItems(req,res){
    const {productId} = req.params;

    const {qty} = req.body
    
    const user = req.user

    const cart = await cartModel.findOne({user:user.id});

    if(!cart){
        return res.status(404).json({
            message:'cart not found'
        })
    }

    const existingItemsIndex = cart.items.findIndex(item=>item.productId.toString() === productId);

    if(existingItemsIndex<0){
        return res.status(404).json({
            message:'item not found'
        })
    }

    cart.items[existingItemsIndex].quantity = qty;

    await cart.save();

    console.log('cart (updateCartItems):', cart);

    return res.status(200).json({
        message:'cart updated successfully',
        cart
    })
}

async function getCart(req,res){
    const user = req.user;

    let cart = await cartModel.findOne({user:user.id});

    if(!cart){
        cart = new cartModel({user:user.id, items:[]});
        await cart.save();
    }

    console.log('cart (getCart):', cart);

    return res.status(200).json({
        cart,
        totals:{
            itemCount:cart.items.length,
            totalQuantity:cart.items.reduce((sum,item)=>sum + item.quantity, 0)
        }
    });
}

module.exports = {
    addItemsToCart,
    updateCartItems,
    getCart
}