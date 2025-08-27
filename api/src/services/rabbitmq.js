const amqp = require('amqplib');

let channel;

async function connect() {
    if(channel) return channel;

    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('[API] Connected to RabbitMQ');
        return channel;
    } catch(err) {
        console.error('[API] Error connecting to RabbitMQ:', err);
        throw err;
    }
}

async function publish(queue, message) {
    const targetChannel = await connect();
    await targetChannel.assertQueue(queue, { durable: true });
    targetChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`[API] Message sent to queue ${queue}:`, message);
}

module.exports = {
    publish
};
