const orderService = require("../services/order.service");

async function createOrder(req, res, next) {
  try {
    const result = await orderService.createOrder(req.body);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await orderService.getOrdersByUser(req.query.userId);
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
};
