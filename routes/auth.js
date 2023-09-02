const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");

const auth = new AuthController();

// LOGIN
router.get("/", auth.login);

module.exports = router;
