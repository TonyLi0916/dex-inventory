const express = require("express");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const pool = require("./db/pool");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cardsRoutes = require("./routes/cardsRoutes");
const sealedRoutes = require("./routes/sealedRoutes");
const compareRoutes = require("./routes/compareRoutes");
const apiRoutes = require("./routes/api");

const app = express();

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours in ms
    },
  }),
);

// Runs for every route and request for user
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.errors = [];
  res.locals.success = null;
  next();
});

// Test DB connection on startup
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected at:", res.rows[0].now);
  }
});

// Routes
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", cardsRoutes);
app.use("/", sealedRoutes);
app.use("/", compareRoutes);
app.use("/", apiRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("index", {
    title: "DexInventory",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DexInventory running on http://localhost:${PORT}`);
});
