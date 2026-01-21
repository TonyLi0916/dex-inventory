const pool = require("../pool");

// Get all cards for a user
async function getCardsByUserId(userId) {
  const result = await pool.query(
    "SELECT * FROM cards WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return result.rows;
}

// Get card by id
async function getCardById(id, userId) {
  const result = await pool.query(
    "SELECT * FROM cards WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
  return result.rows[0];
}

// Create new card
async function createCard(cardData, userId) {
  const {
    name,
    set_name,
    condition,
    quantity,
    purchase_price,
    market_price,
    price_source,
  } = cardData;

  const result = await pool.query(
    `INSERT INTO cards (name, set_name, condition, quantity, purchase_price, market_price, price_source, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      name,
      set_name,
      condition,
      quantity,
      purchase_price,
      market_price,
      price_source,
      userId,
    ],
  );
  return result.rows[0];
}

// Update card
async function updateCard(id, cardData, userId) {
  const {
    name,
    set_name,
    condition,
    quantity,
    purchase_price,
    market_price,
    price_source,
  } = cardData;

  const result = await pool.query(
    `UPDATE cards 
     SET name = $1, set_name = $2, condition = $3, quantity = $4, 
         purchase_price = $5, market_price = $6, price_source = $7, price_updated_at = CURRENT_TIMESTAMP
     WHERE id = $8 AND user_id = $9
     RETURNING *`,
    [
      name,
      set_name,
      condition,
      quantity,
      purchase_price,
      market_price,
      price_source,
      id,
      userId,
    ],
  );
  return result.rows[0];
}

// Delete card
async function deleteCard(id, userId) {
  const result = await pool.query(
    "DELETE FROM cards WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId],
  );
  return result.rows[0];
}

// Get total value of all cards for a user
async function getCardsValue(userId) {
  const result = await pool.query(
    `SELECT 
       COALESCE(SUM(market_price * quantity), 0) as total_value,
       COALESCE(SUM(purchase_price * quantity), 0) as total_cost,
       COALESCE(SUM(quantity), 0) as total_quantity,
       COUNT(*) as unique_cards
     FROM cards 
     WHERE user_id = $1`,
    [userId],
  );
  return result.rows[0];
}

module.exports = {
  getCardsByUserId,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getCardsValue,
};
