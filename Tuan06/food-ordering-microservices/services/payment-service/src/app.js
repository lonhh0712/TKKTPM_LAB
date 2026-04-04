const express = require("express");
const paymentRoutes = require("./routes/payment.routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "payment-service" });
});

app.use("/payments", paymentRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: error.message || "Internal error" });
});

module.exports = app;
