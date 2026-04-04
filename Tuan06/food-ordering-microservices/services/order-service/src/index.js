const port = Number(process.env.PORT || 3002);
const app = require("./app");
const {
  startPaymentCompletedConsumer,
} = require("./services/payment-event-consumer.service");

app.listen(port, () => {
  console.log(`Order Service is running on port ${port}`);
  startPaymentCompletedConsumer();
});
