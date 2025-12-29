const mongoose = require('mongoose');

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('connected to db of ai-service');
    } catch (err) {
        console.log('failed to connect to db of ai-service', err)
    }
}

module.exports = connectDB;