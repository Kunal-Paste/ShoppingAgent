const {Server} = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

async function initSocketServer(httpServer){
    
    const io = new Server(httpServer,{});

    io.use((socket,next)=>{
        const cookies = socket.handshake.headers?.cookie;

        const {token} = cookies ? cookie.parse(cookies) : {};

        if(!token){
            return next(new Error('token not provided'));
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            
            socket.user = decoded;

            next();

        } catch (err) {
            next(new Error('invalid token',err))
        }

    })

    io.on('connection',(socket)=>{
         console.log('a user connected to socket server')
    });

}

module.exports = {
    initSocketServer
}