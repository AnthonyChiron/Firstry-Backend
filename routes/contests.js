const express = require("express");
const router = express.Router();
const ContestsController = require("../controllers/contests");

const contests = new ContestsController();

// GET ALL CONTESTS
router.get("/", contests.getAll);

// GET CONTEST BY ID
router.get("/:id", contests.getById);

// POST CONTEST
router.post("/", contests.post);

// PUT CONTEST
router.put("/:id", contests.update);

// DELETE CONTEST
router.delete("/:id", contests.deleteById);

module.exports = router;
