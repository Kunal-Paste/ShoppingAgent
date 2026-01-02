const express = require('express');
const {connect} = require('./broker/broker');
const setListener = require('./broker/listner')

const app = express();

connect().then(()=>{
    setListener();
})

app.get('/',(req,res)=>{
    res.send('notification service is up and running');
})

module.exports = app;