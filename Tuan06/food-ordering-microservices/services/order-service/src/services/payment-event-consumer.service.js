const amqp = require("amqplib");
const orderService = require("./order.service");

const rabbitUrl =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

async function startPaymentCompletedConsumer() {
  try {
    const conn = await amqp.connect(rabbitUrl);
    const channel = await conn.createChannel();
    const queue = "payment.completed";

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());
        const orderId = event?.data?.orderId;

        await orderService.applyPaymentCompleted(orderId);
        channel.ack(msg);
      } catch (error) {
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    setTimeout(startPaymentCompletedConsumer, 5000);
  }
}

module.exports = {
  startPaymentCompletedConsumer,
};
