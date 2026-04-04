const db = require("../config/db");

async function createOrder(userId, items, totalAmount) {
  const result = await db.query(
    "INSERT INTO orders(user_id, items, total_amount, status) VALUES($1, $2::jsonb, $3, $4) RETURNING *",
    [userId, JSON.stringify(items), totalAmount, "PENDING"],
  );
  return result.rows[0];
}

async function findById(id) {
  const result = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function findByUserId(userId) {
  const result = await db.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return result.rows;
}

async function updateToPaid(orderId) {
  await db.query(
    "UPDATE orders SET status = $1, updated_at = now() WHERE id = $2",
    ["PAID", orderId],
  );
}

module.exports = {
  createOrder,
  findById,
  findByUserId,
  updateToPaid,
};
