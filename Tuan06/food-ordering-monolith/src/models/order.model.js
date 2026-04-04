const db = require("../config/db");

async function createOrder({ userId, items, totalAmount }) {
  const result = await db.query(
    `INSERT INTO orders (user_id, items, total_amount, status)
     VALUES ($1, $2::jsonb, $3, 'PENDING')
     RETURNING id, user_id, items, total_amount, status, created_at, paid_at`,
    [userId, JSON.stringify(items), totalAmount],
  );
  return result.rows[0];
}

async function findOrdersByUser(userId) {
  const result = await db.query(
    `SELECT id, user_id, items, total_amount, status, created_at, paid_at
     FROM orders
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );
  return result.rows;
}

async function findOrderById(orderId) {
  const result = await db.query(
    `SELECT id, user_id, items, total_amount, status, created_at, paid_at
     FROM orders
     WHERE id = $1`,
    [orderId],
  );
  return result.rows[0] || null;
}

async function markOrderPaid(orderId) {
  const result = await db.query(
    `UPDATE orders
     SET status = 'PAID', paid_at = now()
     WHERE id = $1 AND status = 'PENDING'
     RETURNING id, user_id, items, total_amount, status, created_at, paid_at`,
    [orderId],
  );
  return result.rows[0] || null;
}

module.exports = {
  createOrder,
  findOrdersByUser,
  findOrderById,
  markOrderPaid,
};
