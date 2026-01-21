const pool = require("../pool");

// Get all sealed products for a user
async function getSealedByUserId(userId) {
  const result = await pool.query(
    "SELECT * FROM sealed_products WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return result.rows;
}

// Get sealed product by id
async function getSealedById(id, userId) {
  const result = await pool.query(
    "SELECT * FROM sealed_products WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
  return result.rows[0];
}

// Create new sealed product
async function createSealed(sealedData, userId) {
  const {
    product_name,
    product_type,
    quantity,
    purchase_price,
    market_price,
    price_source,
  } = sealedData;

  const result = await pool.query(
    `INSERT INTO sealed_products (product_name, product_type, quantity, purchase_price, market_price, price_source, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      product_name,
      product_type,
      quantity,
      purchase_price,
      market_price,
      price_source,
      userId,
    ],
  );
  return result.rows[0];
}

// Update sealed product
async function updateSealed(id, sealedData, userId) {
  const {
    product_name,
    product_type,
    quantity,
    purchase_price,
    market_price,
    price_source,
  } = sealedData;

  const result = await pool.query(
    `UPDATE sealed_products 
     SET product_name = $1, product_type = $2, quantity = $3, 
         purchase_price = $4, market_price = $5, price_source = $6, price_updated_at = CURRENT_TIMESTAMP
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
    [
      product_name,
      product_type,
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

// Delete sealed product
async function deleteSealed(id, userId) {
  const result = await pool.query(
    "DELETE FROM sealed_products WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId],
  );
  return result.rows[0];
}

// Get total value of all sealed products for a user
async function getSealedValue(userId) {
  const result = await pool.query(
    `SELECT 
       COALESCE(SUM(market_price * quantity), 0) as total_value,
       COALESCE(SUM(purchase_price * quantity), 0) as total_cost,
       COALESCE(SUM(quantity), 0) as total_quantity,
       COUNT(*) as unique_products
     FROM sealed_products 
     WHERE user_id = $1`,
    [userId],
  );
  return result.rows[0];
}

module.exports = {
  getSealedByUserId,
  getSealedById,
  createSealed,
  updateSealed,
  deleteSealed,
  getSealedValue,
};
