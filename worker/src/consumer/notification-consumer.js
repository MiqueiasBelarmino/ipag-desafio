const amqp = require("amqplib");
const fetch = require("node-fetch");
const logger = require("../utils/logger");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const QUEUE = process.env.QUEUE_NAME || "order_status_updates";
const API_URL = process.env.API_URL || "http://api:3000/api";

(async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    channel.consume(QUEUE, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());

        try {
          const res = await fetch(`${API_URL}/notifications/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(content),
          });

          if (!res.ok) {
            logger.error('[worker] notification-consumer:consumer API call failed', { error: res, queue: QUEUE});
          } else {
            channel.ack(msg);
          }
        } catch (err) {
          logger.error('[worker] notification-consumer:consumer failed', { error: err, queue: QUEUE});
        }
      }
    });
  } catch (err) {
    logger.error('[worker] notification-consumer:consumer connection failed', { error: err });

    process.exit(1);
  }
})();
