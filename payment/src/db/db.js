const mongoose = require('mongoose');

async function connectDB(){
    try {
       await mongoose.connect(process.env.MONGODB_URL);
       console.log('connected to payment db') 
    } catch (err) {
        console.log('failed to connect to payment db',err)
    }
}

module.exports = connectDB;