const paymentService = require("../services/payment.service");

async function createPayment(req, res, next) {
  try {
    const payment = await paymentService.createPayment(req.body);
    return res.status(201).json(payment);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPayment,
};
