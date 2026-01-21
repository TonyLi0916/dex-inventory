const cardQueries = require("../db/queries/cards");
const sealedQueries = require("../db/queries/sealed");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Get stats for cards and sealed products
    const cardsStats = await cardQueries.getCardsValue(userId);
    const sealedStats = await sealedQueries.getSealedValue(userId);

    // Calculate totals
    const totalValue =
      parseFloat(cardsStats.total_value) + parseFloat(sealedStats.total_value);
    const totalCost =
      parseFloat(cardsStats.total_cost) + parseFloat(sealedStats.total_cost);
    const unrealizedGain = totalValue - totalCost;
    const percentageGain =
      totalCost > 0 ? ((unrealizedGain / totalCost) * 100).toFixed(2) : 0;

    res.render("dashboard", {
      title: "DexInventory 🖥️",
      stats: {
        totalValue: totalValue.toFixed(2),
        totalCost: totalCost.toFixed(2),
        unrealizedGain: unrealizedGain.toFixed(2),
        percentageGain,
        cards: {
          value: parseFloat(cardsStats.total_value).toFixed(2),
          quantity: cardsStats.total_quantity,
          unique: cardsStats.unique_cards,
        },
        sealed: {
          value: parseFloat(sealedStats.total_value).toFixed(2),
          quantity: sealedStats.total_quantity,
          unique: sealedStats.unique_products,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.render("dashboard", {
      title: "DexInventory 🖥️",
      stats: null,
      errors: [{ msg: "Error loading dashboard data" }],
    });
  }
};
