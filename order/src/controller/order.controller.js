const orderModel = require('../model/order.model');
const axios = require('axios');

async function createOrder(req,res){
    const user = req.user
    
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    try {
        const cartResponse = await axios.get(`http://localhost:3002/api/cart`,{
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

        console.log('product fetched', products);

    } catch (err) {
         res.status(500).json({
            message:'internal server error',
            error:err
         })
    }
}

module.exports = {
    createOrder
}
