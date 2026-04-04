const db = require("../config/db");

async function findByEmail(email) {
  const result = await db.query(
    `SELECT id, full_name, email, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await db.query(
    `SELECT id, full_name, email, created_at
     FROM users
     WHERE id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

async function createUser({ fullName, email, passwordHash }) {
  const result = await db.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, created_at`,
    [fullName, email, passwordHash],
  );

  return result.rows[0];
}

module.exports = {
  findByEmail,
  findById,
  createUser,
};
