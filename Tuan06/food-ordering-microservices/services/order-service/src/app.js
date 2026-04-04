const express = require("express");
const orderRoutes = require("./routes/order.routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "order-service" });
});

app.use("/orders", orderRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: error.message || "Internal error" });
});

module.exports = app;
