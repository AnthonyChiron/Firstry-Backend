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

router.get("/getPoolsByStepId/:stepId", pools.getPoolsByStepId);
router.post("/createPoolsByStepId/:stepId", isOrganizer, pools.createPools);
router.post(
  "/updatePoolsByStepId/:stepId",
  isOrganizer,
  pools.updatePoolsByStepId
);

module.exports = router;
