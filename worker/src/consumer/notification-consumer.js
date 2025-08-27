const amqp = require("amqplib");
const fetch = require("node-fetch");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const QUEUE = process.env.QUEUE_NAME || "order_status_updates";
const API_URL = process.env.API_URL || "http://api:3000/api";

(async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    console.log(`[Worker] Aguardando mensagens na fila "${QUEUE}"...`);

    channel.consume(QUEUE, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log("[Worker] Mensagem recebida");

        try {
          const res = await fetch(`${API_URL}/notifications/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(content),
          });

          if (!res.ok) {
            console.error("[Worker] Erro ao chamar API:", res.status, await res.text());
          } else {
            console.log("[Worker] Notificação enviada para API com sucesso!");
            channel.ack(msg); // confirma processamento
          }
        } catch (err) {
          console.error("[Worker] Falha ao enviar para API:", err.message);
          // não dá ack → a msg volta pra fila
        }
      }
    });
  } catch (err) {
    console.error("[Worker] Erro de conexão:", err.message);
    process.exit(1);
  }
})();
