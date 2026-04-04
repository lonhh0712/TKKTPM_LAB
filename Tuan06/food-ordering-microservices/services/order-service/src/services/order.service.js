const orderRepository = require("../repositories/order.repository");
const paymentClient = require("./payment-client.service");

async function createOrder(payload) {
  const { userId, items, totalAmount } = payload;

  if (!userId || !Array.isArray(items) || items.length === 0 || !totalAmount) {
    const error = new Error("userId, items, totalAmount are required");
    error.statusCode = 400;
    throw error;
  }

  const order = await orderRepository.createOrder(userId, items, totalAmount);

  try {
    await paymentClient.createPayment(order);
    return { statusCode: 201, body: order };
  } catch (error) {
    return {
      statusCode: 202,
      body: {
        message: "Order created, payment pending retry",
        order,
      },
    };
  }
}

async function getOrderById(id) {
  const order = await orderRepository.findById(id);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  return order;
}

async function getOrdersByUser(userId) {
  if (!userId) {
    const error = new Error("userId is required");
    error.statusCode = 400;
    throw error;
  }

  return orderRepository.findByUserId(userId);
}

async function applyPaymentCompleted(orderId) {
  if (orderId) {
    await orderRepository.updateToPaid(orderId);
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  applyPaymentCompleted,
};
