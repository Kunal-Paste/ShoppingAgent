require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/db/db');
const {initSocketServer} = require('./src/sockets/socket.server')

const httpServer = http.createServer(app);

connectDB();
initSocketServer(httpServer);


httpServer.listen(3005,()=>{
    console.log('ai service is running on port 3005');
    //will work on it tommorrow.
});