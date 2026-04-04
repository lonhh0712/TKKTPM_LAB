const pool = require("./db");

async function run() {
  const region = "APAC";
  const sql = `
    SELECT user_id, full_name, email, region_code, created_at
    FROM users
    WHERE region_code = $1
    ORDER BY created_at DESC
    LIMIT 50
  `;

  const { rows } = await pool.query(sql, [region]);
  console.log("Horizontal partition result:", rows);
}

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => pool.end());
