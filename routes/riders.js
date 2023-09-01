const express = require("express");
const router = express.Router();
const RiderController = require("../controllers/riders");

const rider = new RiderController();

// GET ALL RIDERS
router.get("/", rider.getAll);

// GET RIDER BY ID
router.get("/:id", rider.getById);

// POST RIDER
router.post("/", rider.post);

// DELETE RIDER
router.delete("/:id", rider.deleteById);

// PUT RIDER
router.put("/:id", rider.update);

module.exports = router;
