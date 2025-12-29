require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

app.listen(3005,()=>{
    console.log('ai service is running on port 3005');
});