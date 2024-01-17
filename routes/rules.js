const express = require("express");
const router = express.Router();
const RulesController = require("../controllers/rules");
const { isOrganizer } = require("../middlewares/roleGuard");

const rules = new RulesController();

// CRUD
router.get("/", rules.getAll);
router.get("/getAllByContestId/:id", rules.getRulesByContestId);
router.get("/getById/:id", rules.getById);
router.post("/", isOrganizer, rules.post);
router.put("/:id", isOrganizer, rules.update);
router.delete("/:id", isOrganizer, rules.deleteById);

module.exports = router;
