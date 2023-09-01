const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users");

const users = new UsersController();

// GET ALL RIDERS
router.get("/", users.getAll);

// GET RIDER BY ID
router.get("/:id", users.getById);

// POST RIDER
router.post("/", users.register);

// DELETE RIDER
router.delete("/:id", users.deleteById);

// PUT RIDER
router.put("/:id", users.update);

module.exports = router;
