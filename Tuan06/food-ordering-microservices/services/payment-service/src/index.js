const port = Number(process.env.PORT || 3003);
const app = require("./app");
const { connectBroker } = require("./services/broker.service");

app.listen(port, () => {
  console.log(`Payment Service is running on port ${port}`);
  connectBroker();
});
