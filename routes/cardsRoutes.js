const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const cardsController = require("../controllers/cardsController");
const { requireAuth } = require("../middleware/auth");

const cardValidation = [
  body("name").trim().notEmpty().withMessage("Card name is required"),
  body("set_name").trim().optional(),
  body("condition")
    .isIn([
      "Mint",
      "Near Mint",
      "Lightly Played",
      "Moderately Played",
      "Heavily Played",
      "Damaged",
    ])
    .withMessage("Invalid condition"),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be 0 or greater"),
  body("purchase_price")
    .isFloat({ min: 0 })
    .withMessage("Purchase price must be 0 or greater"),
  body("market_price")
    .isFloat({ min: 0 })
    .withMessage("Market price must be 0 or greater"),
  body("price_source").trim().optional(),
];

router.get("/cards", requireAuth, cardsController.getCards);
router.get("/cards/new", requireAuth, cardsController.getNewCard);
router.post("/cards", requireAuth, cardValidation, cardsController.postCard);
router.get("/cards/:id/edit", requireAuth, cardsController.getEditCard);
router.post(
  "/cards/:id/edit",
  requireAuth,
  cardValidation,
  cardsController.postEditCard,
);
router.post("/cards/:id/delete", requireAuth, cardsController.postDeleteCard);

module.exports = router;
