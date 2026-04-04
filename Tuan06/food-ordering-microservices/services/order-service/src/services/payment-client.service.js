const axios = require("axios");

const paymentServiceUrl =
  process.env.PAYMENT_SERVICE_URL || "http://localhost:3003";

async function createPayment(order) {
  return axios.post(
    `${paymentServiceUrl}/payments`,
    {
      orderId: order.id,
      userId: order.user_id,
      amount: Number(order.total_amount),
    },
    { timeout: 3000 },
  );
}

module.exports = {
  createPayment,
};
