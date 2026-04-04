const express = require("express");

const paymentController = require("../controllers/payment.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { payOrderParamsSchema } = require("../validators/payment.validator");

const router = express.Router();

router.post(
  "/:orderId/pay",
  authMiddleware,
  validate(payOrderParamsSchema, "params"),
  paymentController.payOrder,
);

module.exports = router;
