const amqplib = require('amqplib');

let channel, connection;

async function connect(){
   
    if(connection) return connection;

    try {
      connection = await amqplib.connect(process.env.RABITMQ_URL);
      console.log('connected to rabbitMQ');
      channel = await connection.createChannel();
    } catch (err) {
        console.error('failed to connect to rabbitMQ',err)
    }

}

module.exports = {
    channel,
    connection,
    connect
}