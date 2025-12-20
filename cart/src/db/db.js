const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('connected to db successfully');
    } catch (error) {
        console.log('failed to connect Db of cart',error)
    }
}

module.exports = connectDB;