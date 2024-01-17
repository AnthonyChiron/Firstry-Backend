const express = require("express");
const router = express.Router();
const CategoriesController = require("../controllers/categories");
const { isOrganizer } = require("../middlewares/roleGuard");

const categories = new CategoriesController();

// CRUD
router.get("/", categories.getAll);
router.get("/getById/:id", categories.getById);
router.get("/getAllByContestId/:id", categories.getById);
router.post("/", isOrganizer, categories.createCategory);
router.put("/:id", isOrganizer, categories.updateCategory);
router.delete("/:id", isOrganizer, categories.deleteCategory);

router.get(
  "/getAllCategoriesForRegistrations/:id",
  categories.getAllCategoriesForRegistrations
);
module.exports = router;
