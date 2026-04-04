const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = Number(process.env.PORT || 8080);

const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:3001";
const orderServiceUrl =
  process.env.ORDER_SERVICE_URL || "http://localhost:3002";
const paymentServiceUrl =
  process.env.PAYMENT_SERVICE_URL || "http://localhost:3003";

app.use(cors());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

app.use(
  "/api/users",
  createProxyMiddleware({
    target: userServiceUrl,
    changeOrigin: true,
    pathRewrite: { "^/api/users": "/users" },
  }),
);
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: orderServiceUrl,
    changeOrigin: true,
    pathRewrite: { "^/api/orders": "/orders" },
  }),
);
app.use(
  "/api/payments",
  createProxyMiddleware({
    target: paymentServiceUrl,
    changeOrigin: true,
    pathRewrite: { "^/api/payments": "/payments" },
  }),
);

app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
