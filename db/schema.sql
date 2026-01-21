-- DexInventory Database Schema
DROP TABLE IF EXISTS sealed_products CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cards table 
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  set_name VARCHAR(255),
  condition VARCHAR(50) CHECK (condition IN ('Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  purchase_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
  market_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (market_price >= 0),
  price_source TEXT,
  price_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sealed products table
CREATE TABLE sealed_products (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  product_type VARCHAR(100) CHECK (product_type IN ('Booster Box', 'Elite Trainer Box', 'Tin', 'Collection Box', 'Booster Pack', 'Other')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  purchase_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
  market_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (market_price >= 0),
  price_source TEXT,
  price_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_sealed_products_user_id ON sealed_products(user_id);
CREATE INDEX idx_cards_name ON cards(name);
CREATE INDEX idx_sealed_products_name ON sealed_products(product_name);