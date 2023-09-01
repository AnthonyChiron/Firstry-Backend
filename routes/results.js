const express = require("express");
const router = express.Router();
const ResultsController = require("../controllers/results");

const results = new ResultsController();

// GET ALL RIDERS
router.get("/", results.getAll);

// GET RIDER BY ID
router.get("/:id", results.getById);

// POST RIDER
router.post("/", results.post);

// DELETE RIDER
router.delete("/:id", results.deleteById);

// PUT RIDER
router.put("/:id", results.update);

module.exports = router;
