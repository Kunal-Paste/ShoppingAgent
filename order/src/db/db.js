const mongoose = require('mongoose');

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('connected to order DB');
    } catch (error) {
        console.log('failed to connect to DB in order service', error)
    }
}

module.exports = connectDB;