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

        const price = orderResponse.data.order.totalPrice;

        const order = await razorpay.orders.create(price);

        const payment = await paymentModel.create({
            order:orderId,
            razorpayOrderId:order.id,
            user:req.user.id,
            price:{
                amount:order.amount,
                currency:order.currency
            }
        });

        return res.status(201).json({
            message:'payment initiated',
            payment
        })

    } catch (err) {
        console.log('error while creating payment', err);
        res.status(500).json({
            message:'error while creating payment',
            error:err.message
        })
    }
}

async function verifyPayment(req,res){
    const {razorpayOrderId, paymentId, signature} = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET

    try {
        const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');
        
        const isValid = validatePaymentVerification({
            order_id: razorpayOrderId,
            payment_id: paymentId
        }, signature, secret);

        if(!isValid){
            return res.status(400).json({
                message:'invalid signature'
            })
        }

        const payment = await paymentModel.findOne({razorpayOrderId, status:'PENDING'});

        if(!payment){
            return res.status(404).json({
                message:'payment not found'
            })
        }

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = 'COMPLETED'

        await payment.save();

        res.status(200).json({
            message:'payment verified successfully',
            payment
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message:'internal server error in verifying payment',
            error:err.message
        })
    }
}

module.exports = {
    createPayment,
    verifyPayment
}