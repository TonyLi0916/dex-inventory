const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { redirectIfAuth } = require("../middleware/auth");

// Validation rules
const signupValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage("Username must be between 3 and 25 characters")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

const loginValidation = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.get("/signup", redirectIfAuth, authController.getSignup);
router.post(
  "/signup",
  redirectIfAuth,
  signupValidation,
  authController.postSignup,
);

router.get("/login", redirectIfAuth, authController.getLogin);
router.post(
  "/login",
  redirectIfAuth,
  loginValidation,
  authController.postLogin,
);

router.post("/logout", authController.postLogout);

module.exports = router;
