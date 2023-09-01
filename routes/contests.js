const express = require("express");
const router = express.Router();
const ContestController = require("../controllers/contests");

const contest = new ContestController();

// GET ALL CONTESTS
router.get("/", contest.getAll);

// GET CONTEST BY ID
router.get("/:id", contest.getById);

// POST CONTEST
router.post("/", contest.post);

// DELETE CONTEST
router.delete("/:id", contest.deleteById);

// PUT CONTEST
router.put("/:id", contest.update);

module.exports = router;
