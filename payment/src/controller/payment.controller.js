const paymentModel = require('../model/payment.model');
const axios = require('axios');
const RazorPay = require('razorpay');

const razorpay = new RazorPay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
});

async function createPayment(req,res){
     
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    try {
        const orderId = req.params.orderId;
        
        const orderResponse = await axios.get("http://localhost:3003/api/order/" + orderId, { // written https instead http, which is wrong
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        

    } catch (err) {
        console.log('error while creating payment', err);
        res.status(500).json({
            message:'error while creating payment',
            error:err.message
        })
    }
}

module.exports = {
    createPayment
}