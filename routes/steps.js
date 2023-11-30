const express = require("express");
const router = express.Router();
const StepsController = require("../controllers/steps");

const steps = new StepsController();

// GET ALL RESULTS
router.get("/", steps.getAll);

// GET RESULTS BY ID
router.get("/getById/:id", steps.getById);

// POST RESULTS
router.post("/", steps.post);

// DELETE RESULTS
router.delete("/:id", steps.deleteById);

// PUT RESULTS
router.put("/:id", steps.update);

module.exports = router;
