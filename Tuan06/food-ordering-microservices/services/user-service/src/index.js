const port = Number(process.env.PORT || 3001);
const app = require("./app");

app.listen(port, () => {
  console.log(`User Service is running on port ${port}`);
});
