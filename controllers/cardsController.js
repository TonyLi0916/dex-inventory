const { validationResult } = require("express-validator");
const cardQueries = require("../db/queries/cards");

// GET /cards
exports.getCards = async (req, res) => {
  try {
    const cards = await cardQueries.getCardsByUserId(req.session.user.id);
    const stats = await cardQueries.getCardsValue(req.session.user.id);

    res.render("cards/index", {
      title: "DexInventory 🖥️",
      cards,
      stats,
    });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.render("cards/index", {
      title: "DexInventory 🖥️",
      cards: [],
      stats: null,
      errors: [{ msg: "Error loading cards" }],
    });
  }
};

// GET /cards/new
exports.getNewCard = (req, res) => {
  res.render("cards/new", {
    title: "DexInventory 🖥️",
    errors: [],
  });
};

// POST /cards
exports.postCard = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("cards/new", {
      title: "DexInventory 🖥️",
      errors: errors.array(),
    });
  }

  try {
    await cardQueries.createCard(req.body, req.session.user.id);
    res.redirect("/cards");
  } catch (error) {
    console.error("Error creating card:", error);
    res.render("cards/new", {
      title: "DexInventory 🖥️",
      errors: [{ msg: "Error creating card" }],
    });
  }
};

// GET /cards/:id/edit
exports.getEditCard = async (req, res) => {
  try {
    const card = await cardQueries.getCardById(
      req.params.id,
      req.session.user.id,
    );

    if (!card) {
      return res.redirect("/cards");
    }

    res.render("cards/edit", {
      title: "DexInventory 🖥️",
      card,
      errors: [],
    });
  } catch (error) {
    console.error("Error fetching card:", error);
    res.redirect("/cards");
  }
};

// POST /cards/:id/edit
exports.postEditCard = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const card = await cardQueries.getCardById(
      req.params.id,
      req.session.user.id,
    );
    return res.render("cards/edit", {
      title: "DexInventory 🖥️",
      card,
      errors: errors.array(),
    });
  }

  try {
    await cardQueries.updateCard(req.params.id, req.body, req.session.user.id);
    res.redirect("/cards");
  } catch (error) {
    console.error("Error updating card:", error);
    res.redirect("/cards");
  }
};

// POST /cards/:id/delete
exports.postDeleteCard = async (req, res) => {
  try {
    await cardQueries.deleteCard(req.params.id, req.session.user.id);
    res.redirect("/cards");
  } catch (error) {
    console.error("Error deleting card:", error);
    res.redirect("/cards");
  }
};
