const express = require("express");
const router = express.Router();
const ResultsController = require("../controllers/results");

const results = new ResultsController();

// GET ALL RESULTS
router.get("/", results.getAll);

// GET RESULTS BY ID
router.get("/:id", results.getById);

// POST RESULTS
router.post("/", results.post);

// DELETE RESULTS
router.delete("/:id", results.deleteById);

// PUT RESULTS
router.put("/:id", results.update);

module.exports = router;
