const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const sealedController = require("../controllers/sealedController");
const { requireAuth } = require("../middleware/auth");

const sealedValidation = [
  body("product_name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),
  body("product_type")
    .isIn([
      "Booster Box",
      "Elite Trainer Box",
      "Tin",
      "Collection Box",
      "Booster Pack",
      "Other",
    ])
    .withMessage("Invalid product type"),
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

router.get("/sealed", requireAuth, sealedController.getSealed);
router.get("/sealed/new", requireAuth, sealedController.getNewSealed);
router.post(
  "/sealed",
  requireAuth,
  sealedValidation,
  sealedController.postSealed,
);
router.get("/sealed/:id/edit", requireAuth, sealedController.getEditSealed);
router.post(
  "/sealed/:id/edit",
  requireAuth,
  sealedValidation,
  sealedController.postEditSealed,
);
router.post(
  "/sealed/:id/delete",
  requireAuth,
  sealedController.postDeleteSealed,
);

module.exports = router;
