const express = require("express");
const router = express.Router();
const PoolsController = require("../controllers/pools");

const pools = new PoolsController();

// GET ALL RESULTS
router.get("/", pools.getAll);

// GET RESULTS BY ID
router.get("/getById/:id", pools.getById);

// POST RESULTS
router.post("/", pools.post);

// DELETE RESULTS
router.delete("/:id", pools.deleteById);

// PUT RESULTS
router.put("/:id", pools.update);

module.exports = router;
