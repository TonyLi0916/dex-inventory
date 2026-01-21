const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const userQueries = require("../db/queries/users");

// GET /signup
exports.getSignup = (req, res) => {
  res.render("signup", {
    title: "DexInventory 🖥️",
    errors: [],
  });
};

// POST /signup
exports.postSignup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("signup", {
      title: "DexInventory 🖥️",
      errors: errors.array(),
    });
  }

  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userQueries.findUserByUsername(username);

    if (existingUser) {
      return res.render("signup", {
        title: "DexInventory 🖥️",
        errors: [{ msg: "Username already taken" }],
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await userQueries.createUser(username, passwordHash);

    // Log user in automatically
    req.session.user = {
      id: newUser.id,
      username: newUser.username,
    };

    res.redirect("/");
  } catch (error) {
    console.error("Signup error:", error);
    res.render("signup", {
      title: "DexInventory 🖥️",
      errors: [{ msg: "An error occurred. Please try again." }],
    });
  }
};

// GET /login
exports.getLogin = (req, res) => {
  res.render("login", {
    title: "DexInventory 🖥️",
    errors: [],
  });
};

// POST /login
exports.postLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("login", {
      title: "DexInventory 🖥️",
      errors: errors.array(),
    });
  }

  const { username, password } = req.body;

  try {
    // Find user
    const user = await userQueries.findUserByUsername(username);

    if (!user) {
      return res.render("login", {
        title: "DexInventory 🖥️",
        errors: [{ msg: "Invalid username or password" }],
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.render("login", {
        title: "DexInventory 🖥️",
        errors: [{ msg: "Invalid username or password" }],
      });
    }

    // Create session
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", {
      title: "DexInventory 🖥️",
      errors: [{ msg: "An error occurred. Please try again." }],
    });
  }
};

// POST /logout
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
};
