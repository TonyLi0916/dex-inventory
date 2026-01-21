const express = require("express");
const router = express.Router();
const compareController = require("../controllers/compareController");
const { requireAuth } = require("../middleware/auth");

router.get("/compare", requireAuth, compareController.getCompare);
router.post("/compare", requireAuth, compareController.postCompare);

module.exports = router;
