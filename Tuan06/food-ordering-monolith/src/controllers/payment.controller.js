const paymentService = require("../services/payment.service");

async function payOrder(req, res, next) {
  try {
    const result = await paymentService.payOrder(
      req.user.userId,
      req.params.orderId,
    );
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  payOrder,
};
