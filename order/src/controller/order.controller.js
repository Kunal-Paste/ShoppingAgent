const orderModel = require('../model/order.model');
const axios = require('axios');

async function createOrder(req,res){
    const user = req.user
    
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    try {
        const cartResponse = await axios.get(`http://localhost:3002/api/cart`,{ // error by me for not using await
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        const items = cartResponse.data?.cart?.items || [];

        const products = await Promise.all(items.map(async (item) => {
            const resp = await axios.get(`http://localhost:3001/api/products/${item.productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // product service sometimes returns { product } for single-product endpoint
            // and { data } for list endpoints. Accept either shape.
            return resp.data?.product ?? resp.data?.data ?? null;
        }));

        let priceAmount = 0;

        const orderItems = items.map((item) => {
            const product = products.find((p) => p?._id?.toString() === item.productId);

            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            if (Number(product.stock) < Number(item.quantity)) {
                throw new Error(`Product ${product.title} has insufficient stock`);
            }

            const itemTotal = Number(product.price.amount) * Number(item.quantity);
            priceAmount += itemTotal;

            return {
                product: item.productId,
                quantity: item.quantity,
                price: {
                    amount: itemTotal,
                    currency: product.price.currency
                }
            };
        });

        const order = await orderModel.create({
            user:user.id,
            items:orderItems,
            status:"PENDING",
            totalPrice:{
                amount:priceAmount,
                currency:"INR"
            },
            shippingAddress:{
                street:req.body.shippingAddress.street,
                city:req.body.shippingAddress.city,
                state:req.body.shippingAddress.state,
                zip:req.body.shippingAddress.pincode,
                country:req.body.shippingAddress.country,
            }
        })

        res.status(201).json({ order });
        

    } catch (err) {
        console.error('createOrder error', err);
        return res.status(500).json({
            message: 'internal server error',
            error: err?.message ?? String(err)
        });
    }
}

module.exports = {
    createOrder
}
