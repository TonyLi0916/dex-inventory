const pool = require("../pool");

// Find user by username
async function findUserByUsername(username) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
}

// Find user by id
async function findUserById(id) {
  const result = await pool.query(
    "SELECT id, username, created_at FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0];
}

// Create new user
async function createUser(username, passwordHash) {
  const result = await pool.query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at",
    [username, passwordHash],
  );
  return result.rows[0];
}

module.exports = {
  findUserByUsername,
  findUserById,
  createUser,
};
