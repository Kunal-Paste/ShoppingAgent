require('dotenv').config();
const app = require('./src/app');
const {connect} = require('./src/broker/broker');

// connect();


app.listen(3006,()=>{
    console.log('notification service is running on port 3006');
})
