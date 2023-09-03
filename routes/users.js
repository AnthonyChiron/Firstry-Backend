const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const UsersController = require("../controllers/users");

const users = new UsersController();

// CRUD
router.get("/", users.getAll);
router.get("/:id", users.getById);
router.post("/", users.register);
router.delete("/:id", users.deleteById);
router.put("/:id", users.update);

// GET CONNECTED USER
router.get("/me", auth, users.me);

// UPDATE EMAIL
router.post("/updateemail", users.updateEmail);

// VALIDATE EMAIL
router.post("/validateemail", users.validateEmail);

// RESET PASSWORD
router.post("/resetPassword", users.resetPassword);

module.exports = router;
