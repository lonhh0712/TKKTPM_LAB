const amqp = require("amqplib");

const rabbitUrl =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

let channel;

async function connectBroker() {
  try {
    const conn = await amqp.connect(rabbitUrl);
    channel = await conn.createChannel();
    await channel.assertQueue("payment.completed", { durable: true });
  } catch (error) {
    setTimeout(connectBroker, 5000);
  }
}

function publishPaymentCompleted(event) {
  if (!channel) {
    return false;
  }

  return channel.sendToQueue(
    "payment.completed",
    Buffer.from(JSON.stringify(event)),
    {
      persistent: true,
    },
  );
}

module.exports = {
  connectBroker,
  publishPaymentCompleted,
};
