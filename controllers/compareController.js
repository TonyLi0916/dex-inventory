const comparisonQueries = require("../db/queries/comparisons");

exports.getCompare = async (req, res) => {
  try {
    const users = await comparisonQueries.getAllUsersExceptCurrent(
      req.session.user.id,
    );

    res.render("compare", {
      title: "DexInventory 🖥️",
      users,
      comparison: null,
    });
  } catch (error) {
    console.error("Error loading compare page:", error);
    res.render("compare", {
      title: "Compare Collections - DexInventory",
      users: [],
      comparison: null,
      errors: [{ msg: "Error loading users" }],
    });
  }
};

exports.postCompare = async (req, res) => {
  try {
    const userId1 = req.session.user.id;
    const userId2 = parseInt(req.body.compareUserId);

    if (!userId2 || userId1 === userId2) {
      const users = await comparisonQueries.getAllUsersExceptCurrent(userId1);
      return res.render("compare", {
        title: "DexInventory 🖥️",
        users,
        comparison: null,
        errors: [{ msg: "Please select a valid user to compare" }],
      });
    }

    const data = await comparisonQueries.getComparisonData(userId1, userId2);
    const users = await comparisonQueries.getAllUsersExceptCurrent(userId1);

    // Process the data for easier rendering
    const user1Data = {
      username: data.users.find((u) => u.id === userId1)?.username || "You",
      cards: data.cardsStats.find((c) => c.user_id === userId1) || {
        total_value: 0,
        total_quantity: 0,
        unique_cards: 0,
      },
      sealed: data.sealedStats.find((s) => s.user_id === userId1) || {
        total_value: 0,
        total_quantity: 0,
        unique_products: 0,
      },
    };

    const user2Data = {
      username: data.users.find((u) => u.id === userId2)?.username || "User",
      cards: data.cardsStats.find((c) => c.user_id === userId2) || {
        total_value: 0,
        total_quantity: 0,
        unique_cards: 0,
      },
      sealed: data.sealedStats.find((s) => s.user_id === userId2) || {
        total_value: 0,
        total_quantity: 0,
        unique_products: 0,
      },
    };

    // Calculate totals
    user1Data.totalValue =
      parseFloat(user1Data.cards.total_value) +
      parseFloat(user1Data.sealed.total_value);
    user2Data.totalValue =
      parseFloat(user2Data.cards.total_value) +
      parseFloat(user2Data.sealed.total_value);

    res.render("compare", {
      title: "DexInventory 🖥️",
      users,
      comparison: { user1: user1Data, user2: user2Data },
    });
  } catch (error) {
    console.error("Error comparing collections:", error);
    const users = await comparisonQueries.getAllUsersExceptCurrent(
      req.session.user.id,
    );
    res.render("compare", {
      title: "DexInventory 🖥️",
      users,
      comparison: null,
      errors: [{ msg: "Error comparing collections" }],
    });
  }
};
