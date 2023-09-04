const express = require("express");
const router = express.Router();
const CategoriesController = require("../controllers/categories");

const categories = new CategoriesController();

// CRUD
router.get("/", categories.getAll);
router.get("/:id", categories.getById);
router.post("/", categories.post);
router.put("/:id", categories.update);
router.delete("/:id", categories.deleteById);

module.exports = router;
