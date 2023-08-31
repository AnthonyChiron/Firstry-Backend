const express = require("express");
const router = express.Router();
const riderController = require("../controllers/riders");

// GET ALL RIDERS
router.get("/", riderController.getAllRiders);

// GET RIDER BY ID
router.get("/:id", riderController.getRiderById);

// POST RIDER
router.post("/", riderController.createRider);

// DELETE RIDER
router.delete("/:id", riderController.deleteRiderById);

// PUT RIDER
router.put("/:id", riderController.updateRider);

module.exports = router;
