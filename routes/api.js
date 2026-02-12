const express = require("express");
const router = express.Router();
const priceController = require("../controllers/priceController");
const { requireAuth } = require("../middleware/auth");

router.post(
  "/api/cards/:id/check-price",
  requireAuth,
  priceController.checkCardPrice,
);

router.post(
  "/api/sealeds/:id/check-price",
  requireAuth,
  priceController.checkSealedPrice,
);

router.post(
  "/api/cards/preview-price",
  requireAuth,
  priceController.previewCardPrice,
);

router.post(
  "/api/sealeds/preview-price",
  requireAuth,
  priceController.previewSealedPrice,
);

module.exports = router;
