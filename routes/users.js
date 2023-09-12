const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users");

const users = new UsersController();

// CRUD
router.get("/", users.getAll);
router.get("/:id", users.getById);
router.post("/", users.register);
router.delete("/:id", users.deleteById);
router.put("/:id", users.update);

// UPDATE EMAIL
router.post("/updateemail", users.updateEmail);

// GET USER BY GOOGLE_ID
router.get("/getUserByGoogleId/:googleId", users.getUserByGoogleId);

module.exports = router;
