const express = require("express");

const orderController = require("../controllers/order.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { createOrderSchema } = require("../validators/order.validator");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate(createOrderSchema),
  orderController.createOrder,
);
router.get("/", authMiddleware, orderController.history);

module.exports = router;
