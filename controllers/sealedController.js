const { validationResult } = require("express-validator");
const sealedQueries = require("../db/queries/sealed");

exports.getSealed = async (req, res) => {
  try {
    const sealed = await sealedQueries.getSealedByUserId(req.session.user.id);
    const stats = await sealedQueries.getSealedValue(req.session.user.id);

    res.render("sealed/index", {
      title: "DexInventory 🖥️",
      sealed,
      stats,
    });
  } catch (error) {
    console.error("Error fetching sealed:", error);
    res.render("sealed/index", {
      title: "DexInventory 🖥️",
      sealed: [],
      stats: null,
      errors: [{ msg: "Error loading sealed products" }],
    });
  }
};

exports.getNewSealed = (req, res) => {
  res.render("sealed/new", {
    title: "DexInventory 🖥️",
    errors: [],
  });
};

exports.postSealed = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("sealed/new", {
      title: "DexInventory 🖥️",
      errors: errors.array(),
    });
  }

  try {
    await sealedQueries.createSealed(req.body, req.session.user.id);
    res.redirect("/sealed");
  } catch (error) {
    console.error("Error creating sealed:", error);
    res.render("sealed/new", {
      title: "DexInventory 🖥️",
      errors: [{ msg: "Error creating sealed product" }],
    });
  }
};

exports.getEditSealed = async (req, res) => {
  try {
    const sealed = await sealedQueries.getSealedById(
      req.params.id,
      req.session.user.id,
    );

    if (!sealed) {
      return res.redirect("/sealed");
    }

    res.render("sealed/edit", {
      title: "DexInventory 🖥️",
      sealed,
      errors: [],
    });
  } catch (error) {
    console.error("Error fetching sealed:", error);
    res.redirect("/sealed");
  }
};

exports.postEditSealed = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const sealed = await sealedQueries.getSealedById(
      req.params.id,
      req.session.user.id,
    );
    return res.render("sealed/edit", {
      title: "DexInventory 🖥️",
      sealed,
      errors: errors.array(),
    });
  }

  try {
    await sealedQueries.updateSealed(
      req.params.id,
      req.body,
      req.session.user.id,
    );
    res.redirect("/sealed");
  } catch (error) {
    console.error("Error updating sealed:", error);
    res.redirect("/sealed");
  }
};

exports.postDeleteSealed = async (req, res) => {
  try {
    await sealedQueries.deleteSealed(req.params.id, req.session.user.id);
    res.redirect("/sealed");
  } catch (error) {
    console.error("Error deleting sealed:", error);
    res.redirect("/sealed");
  }
};
