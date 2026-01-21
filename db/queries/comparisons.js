const pool = require("../pool");

// Get all users except current user
async function getAllUsersExceptCurrent(currentUserId) {
  const result = await pool.query(
    "SELECT id, username FROM users WHERE id != $1 ORDER BY username",
    [currentUserId],
  );
  return result.rows;
}

// Get comparison data for two users
async function getComparisonData(userId1, userId2) {
  // Get user info
  const users = await pool.query(
    "SELECT id, username FROM users WHERE id IN ($1, $2)",
    [userId1, userId2],
  );

  // Get cards stats for both users
  const cardsStats = await pool.query(
    `SELECT 
       user_id,
       COALESCE(SUM(market_price * quantity), 0) as total_value,
       COALESCE(SUM(quantity), 0) as total_quantity,
       COUNT(*) as unique_cards
     FROM cards 
     WHERE user_id IN ($1, $2)
     GROUP BY user_id`,
    [userId1, userId2],
  );

  // Get sealed stats for both users
  const sealedStats = await pool.query(
    `SELECT 
       user_id,
       COALESCE(SUM(market_price * quantity), 0) as total_value,
       COALESCE(SUM(quantity), 0) as total_quantity,
       COUNT(*) as unique_products
     FROM sealed_products 
     WHERE user_id IN ($1, $2)
     GROUP BY user_id`,
    [userId1, userId2],
  );

  return {
    users: users.rows,
    cardsStats: cardsStats.rows,
    sealedStats: sealedStats.rows,
  };
}

module.exports = {
  getAllUsersExceptCurrent,
  getComparisonData,
};
