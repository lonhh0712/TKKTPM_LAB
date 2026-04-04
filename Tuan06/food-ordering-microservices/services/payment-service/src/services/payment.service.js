const paymentRepository = require("../repositories/payment.repository");
const brokerService = require("./broker.service");

async function createPayment(payload) {
  const { orderId, userId, amount } = payload;

  if (!orderId || !userId || !amount) {
    const error = new Error("orderId, userId, amount are required");
    error.statusCode = 400;
    throw error;
  }

  const transactionRef = `MOCK_TXN_${orderId}_${Date.now()}`;
  const payment = await paymentRepository.createPayment(
    orderId,
    userId,
    amount,
    "COMPLETED",
    transactionRef,
  );

  const event = {
    eventType: "PaymentCompleted",
    occurredAt: new Date().toISOString(),
    data: {
      orderId: payment.order_id,
      paymentId: payment.id,
      userId: payment.user_id,
      amount: Number(payment.amount),
      transactionRef: payment.transaction_ref,
    },
  };

  brokerService.publishPaymentCompleted(event);

  return payment;
}

module.exports = {
  createPayment,
};
