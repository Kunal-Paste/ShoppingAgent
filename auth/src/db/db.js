const mongoose = require("mongoose");

async function connectDB(){
    
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to mongodb");
    } catch (err) {
        console.log("not connected to mongodb",err)
    }
}

module.exports = connectDB;