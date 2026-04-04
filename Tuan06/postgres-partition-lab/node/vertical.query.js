const pool = require("./db");

async function run() {
  const userId = 1;

  const basicSql = `
    SELECT user_id, email, status, created_at
    FROM user_basic
    WHERE user_id = $1
  `;

  const fullSql = `
    SELECT b.user_id, b.email, b.status, p.full_name, p.bio, p.preferences
    FROM user_basic b
    LEFT JOIN user_profile p ON p.user_id = b.user_id
    WHERE b.user_id = $1
  `;

  const basic = await pool.query(basicSql, [userId]);
  const full = await pool.query(fullSql, [userId]);

  console.log("Vertical partition basic:", basic.rows[0]);
  console.log("Vertical partition full:", full.rows[0]);
}

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => pool.end());
