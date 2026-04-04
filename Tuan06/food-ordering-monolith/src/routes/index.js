const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const foodRoutes = require("./food.routes");
const orderRoutes = require("./order.routes");
const paymentRoutes = require("./payment.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/foods", foodRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
