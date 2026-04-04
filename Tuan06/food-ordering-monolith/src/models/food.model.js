const db = require("../config/db");

async function listAvailableFoods() {
  const result = await db.query(
    `SELECT id, name, description, price, is_available
     FROM foods
     WHERE is_available = TRUE
     ORDER BY id ASC`,
  );
  return result.rows;
}

async function findFoodsByIds(foodIds) {
  const result = await db.query(
    `SELECT id, name, price, is_available
     FROM foods
     WHERE id = ANY($1::bigint[])`,
    [foodIds],
  );
  return result.rows;
}

module.exports = {
  listAvailableFoods,
  findFoodsByIds,
};
