const orderModel = require("../models/order.model");

function mockGatewayCharge(order) {
  return {
    transactionId: `MOCK_TXN_${order.id}_${Date.now()}`,
    status: "SUCCESS",
    amount: Number(order.total_amount),
  };
}

async function payOrder(userId, orderId) {
  const order = await orderModel.findOrderById(orderId);
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  if (Number(order.user_id) !== Number(userId)) {
    const err = new Error("You cannot pay for this order");
    err.statusCode = 403;
    throw err;
  }

  if (order.status === "PAID") {
    const err = new Error("Order already paid");
    err.statusCode = 400;
    throw err;
  }

  const paymentResult = mockGatewayCharge(order);
  const updatedOrder = await orderModel.markOrderPaid(orderId);

  if (!updatedOrder) {
    const err = new Error("Cannot update payment status");
    err.statusCode = 409;
    throw err;
  }

  return {
    payment: paymentResult,
    order: updatedOrder,
  };
}

module.exports = {
  payOrder,
};
