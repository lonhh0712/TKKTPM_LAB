require("dotenv").config();

const app = require("./app");
const { pool } = require("./config/db");

const PORT = Number(process.env.PORT || 4000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
