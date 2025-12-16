const mongoose = require('mongoose');

async function connectDB(){
    try {
       await mongoose.connect(process.env.MONGODB_URL);
       console.log('connected to mongodb'); 
    } catch (error) {
        console.log('failed to coonect to db',error)
    }
}

module.exports = connectDB;