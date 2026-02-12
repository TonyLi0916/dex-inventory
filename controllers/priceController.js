const ebayService = require("../services/ebayService");
const cardQueries = require("../db/queries/cards");
const sealedQueries = require("../db/queries/sealed");

// POST /api/cards/:id/check-price
exports.checkCardPrice = async (req, res) => {
  try {
    const card = await cardQueries.getCardById(
      req.params.id,
      req.session.user.id,
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found in your collection",
        code: "NOT_FOUND",
      });
    }

    const searchQuery = ebayService.buildCardSearchQuery(card);
    console.log(`Checking price for card: ${card.name} (${searchQuery})`);

    const priceData = await ebayService.searchItems(searchQuery);

    if (!priceData) {
      return res.status(404).json({
        success: false,
        error: "No eBay listings found for this item",
        code: "NO_RESULTS",
      });
    }

    return res.json({
      success: true,
      data: {
        averagePrice: priceData.averagePrice,
        minPrice: priceData.minPrice,
        maxPrice: priceData.maxPrice,
        sampleSize: priceData.sampleSize,
        lastUpdated: priceData.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Price check error:", error);
    return handleEbayError(error, res);
  }
};

// POST /api/sealeds/:id/check-price
exports.checkSealedPrice = async (req, res) => {
  try {
    const product = await sealedQueries.getSealedById(
      req.params.id,
      req.session.user.id,
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Sealed product not found in your collection",
        code: "NOT_FOUND",
      });
    }

    const searchQuery = ebayService.buildSealedSearchQuery(product);
    console.log(
      `Checking price for sealed product: ${product.product_name} (${searchQuery})`,
    );

    const priceData = await ebayService.searchItems(searchQuery);

    if (!priceData) {
      return res.status(404).json({
        success: false,
        error: "No eBay listings found for this item",
        code: "NO_RESULTS",
      });
    }

    return res.json({
      success: true,
      data: {
        averagePrice: priceData.averagePrice,
        minPrice: priceData.minPrice,
        maxPrice: priceData.maxPrice,
        sampleSize: priceData.sampleSize,
        lastUpdated: priceData.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Price check error:", error);
    return handleEbayError(error, res);
  }
};

// POST /api/cards/preview-price
exports.previewCardPrice = async (req, res) => {
  try {
    const { name, set_name, condition } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Card name is required",
        code: "VALIDATION_ERROR",
      });
    }

    const cardData = {
      name,
      set_name: set_name || "",
      condition: condition || "Near Mint",
    };
    const searchQuery = ebayService.buildCardSearchQuery(cardData);

    console.log(`Preview price check for: ${name} (${searchQuery})`);

    const priceData = await ebayService.searchItems(searchQuery);

    if (!priceData) {
      return res.status(404).json({
        success: false,
        error: "No eBay listings found for this item",
        code: "NO_RESULTS",
      });
    }

    return res.json({
      success: true,
      data: {
        averagePrice: priceData.averagePrice,
        minPrice: priceData.minPrice,
        maxPrice: priceData.maxPrice,
        sampleSize: priceData.sampleSize,
        lastUpdated: priceData.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Preview price check error:", error);
    return handleEbayError(error, res);
  }
};

// POST /api/sealeds/preview-price
exports.previewSealedPrice = async (req, res) => {
  try {
    const { product_name, product_type } = req.body;

    if (!product_name) {
      return res.status(400).json({
        success: false,
        error: "Product name is required",
        code: "VALIDATION_ERROR",
      });
    }

    const productData = {
      product_name,
      product_type: product_type || "Booster Box",
    };
    const searchQuery = ebayService.buildSealedSearchQuery(productData);

    console.log(`Preview price check for: ${product_name} (${searchQuery})`);

    const priceData = await ebayService.searchItems(searchQuery);

    if (!priceData) {
      return res.status(404).json({
        success: false,
        error: "No eBay listings found for this item",
        code: "NO_RESULTS",
      });
    }

    return res.json({
      success: true,
      data: {
        averagePrice: priceData.averagePrice,
        minPrice: priceData.minPrice,
        maxPrice: priceData.maxPrice,
        sampleSize: priceData.sampleSize,
        lastUpdated: priceData.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Preview price check error:", error);
    return handleEbayError(error, res);
  }
};

function handleEbayError(error, res) {
  if (error.name === "EbayApiError") {
    if (error.statusCode === 429 || error.message.includes("rate limit")) {
      return res.status(429).json({
        success: false,
        error:
          "eBay API rate limit exceeded. Please wait a few minutes and try again.",
        code: "RATE_LIMIT",
      });
    }

    if (error.statusCode >= 500) {
      return res.status(503).json({
        success: false,
        error: "eBay service temporarily unavailable. Please try again later.",
        code: "SERVICE_UNAVAILABLE",
      });
    }
  }

  return res.status(500).json({
    success: false,
    error: "Failed to check price. Please try again.",
    code: "UNKNOWN_ERROR",
  });
}
