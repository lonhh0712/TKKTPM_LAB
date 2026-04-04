const orderService = require("../services/order.service");

async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.user.userId, req.body);
    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
}

async function history(req, res, next) {
  try {
    const orders = await orderService.getOrderHistory(req.user.userId);
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createOrder,
  history,
};
