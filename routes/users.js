const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const UsersController = require("../controllers/users");

const users = new UsersController();

// GET ALL USERS
router.get("/", users.getAll);

// GET CONNECTED USER
router.get("/me", auth, users.me);

// GET USERS BY ID
router.get("/:id", users.getById);

// POST USERS
router.post("/", users.register);

// DELETE USERS
router.delete("/:id", users.deleteById);

// PUT USERS
router.put("/:id", users.update);

module.exports = router;
