const db = require("../config/db");

async function createPayment(orderId, userId, amount, status, transactionRef) {
  const result = await db.query(
    `INSERT INTO payments(order_id, user_id, amount, status, transaction_ref)
     VALUES($1, $2, $3, $4, $5)
     RETURNING *`,
    [orderId, userId, amount, status, transactionRef],
  );

  return result.rows[0];
}

module.exports = {
  createPayment,
};
