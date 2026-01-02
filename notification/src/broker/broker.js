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

async function publishToQueue(queueName,data={}){

    if(!channel || !connection) await connect();

    await channel.assertQueue(queueName, {
        durable:true
    });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log('message send to queue',queueName,data);
    
}

async function subscribeToQueue(queueName,callback) {
  
    if(!channel || !connection) await connect();

    await channel.assertQueue(queueName,{
        durable:true
    });

    channel.consume(queueName, async(msg)=>{
   
        if(msg !== null){
            const data = JSON.parse(msg.connect.toString());
            await callback(data);
            channel.ack(msg);
        }

    })

}

module.exports = {
    channel,
    connection,
    connect,
    publishToQueue,
    subscribeToQueue
}