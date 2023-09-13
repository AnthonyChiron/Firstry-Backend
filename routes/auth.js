const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");

const auth = new AuthController();

// CRUD
router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.post("/sendNewValidationEmail/:id", auth.sendNewValidationEmail);
router.post("/validateEmail/:id", auth.validateEmail);

module.exports = router;
