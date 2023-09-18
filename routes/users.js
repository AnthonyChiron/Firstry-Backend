const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users");
const functions = require("firebase-functions");

const users = new UsersController();

// CRUD
router.get("/", users.getAll);
router.get("/:id", users.getById);
router.post("/", users.register);
router.delete("/:id", users.deleteById);
router.put("/:id", users.update);

// UPDATE EMAIL
router.post("/updateemail", users.updateEmail);

router.post("/isEmailAvailable", users.isEmailAvailable);

// GET USER BY GOOGLE_ID
router.get("/getUserByGoogleId/:googleId", users.getUserByGoogleId);

router.get("/test/test", users.test);

module.exports = router;
