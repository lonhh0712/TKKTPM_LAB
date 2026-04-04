const pool = require("./db");

async function run() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const user = await client.query(
      "SELECT user_id FROM user_domain.users WHERE email = $1 LIMIT 1",
      ["john@example.com"],
    );

    const product = await client.query(
      "SELECT product_id, price FROM product_domain.products WHERE sku = $1 LIMIT 1",
      ["SKU-100"],
    );

    if (user.rowCount === 0 || product.rowCount === 0) {
      throw new Error("Seed data is missing");
    }

    const quantity = 2;
    const total = Number(product.rows[0].price) * quantity;

    const order = await client.query(
      `INSERT INTO order_domain.orders (user_id, product_id, quantity, total_amount)
       VALUES ($1, $2, $3, $4)
       RETURNING order_id, total_amount, created_at`,
      [user.rows[0].user_id, product.rows[0].product_id, quantity, total],
    );

    await client.query("COMMIT");
    console.log("Functional partition order:", order.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => pool.end());
