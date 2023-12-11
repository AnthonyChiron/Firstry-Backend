const express = require("express");
const router = express.Router();
const CategoriesController = require("../controllers/categories");

const categories = new CategoriesController();

// CRUD
router.get("/", categories.getAll);
router.get("/getById/:id", categories.getById);
router.get("/getAllByContestId/:id", categories.getById);
router.post("/", categories.createCategory);
router.put("/:id", categories.updateCategory);
router.delete("/:id", categories.deleteCategory);

module.exports = router;
