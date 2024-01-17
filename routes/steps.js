const express = require("express");
const router = express.Router();
const StepsController = require("../controllers/steps");
const { isOrganizer } = require("../middlewares/roleGuard");

const steps = new StepsController();

// GET ALL RESULTS
router.get("/", steps.getAll);

// GET RESULTS BY ID
router.get("/getById/:id", steps.getById);

// POST RESULTS
router.post("/", isOrganizer, steps.post);

// DELETE RESULTS
router.delete("/:id", isOrganizer, steps.deleteById);

// PUT RESULTS
router.put("/:id", isOrganizer, steps.update);

module.exports = router;
