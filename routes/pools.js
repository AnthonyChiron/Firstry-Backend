const express = require("express");
const router = express.Router();
const PoolsController = require("../controllers/pools");
const { isOrganizer } = require("../middlewares/roleGuard");

const pools = new PoolsController();

// CRUD
router.get("/", pools.getAll);
router.get("/getById/:id", pools.getById);
router.post("/", isOrganizer, pools.post);
router.delete("/:id", isOrganizer, pools.deleteById);
router.put("/:id", isOrganizer, pools.update);

module.exports = router;
