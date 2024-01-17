const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");
const multer = require("multer");
const { isAuth } = require("../middlewares/authGuard");

const upload = multer({ storage: multer.memoryStorage() });
const auth = new AuthController();

// CRUD
router.post("/signup", upload.single("photo"), auth.signup);
router.post("/login", auth.login);
router.post("/sendNewValidationEmail/:id", isAuth, auth.sendNewValidationEmail);
router.post("/validateEmail/:id", isAuth, auth.validateEmail);

module.exports = router;
