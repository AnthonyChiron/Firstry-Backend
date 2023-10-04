const express = require("express");
const router = express.Router();
const RulesController = require("../controllers/rules");

const rules = new RulesController();

// CRUD
router.get("/", rules.getAll);
router.get("/getById/:id", rules.getById);
router.post("/", rules.post);
router.put("/:id", rules.update);
router.delete("/:id", rules.deleteById);

module.exports = router;
