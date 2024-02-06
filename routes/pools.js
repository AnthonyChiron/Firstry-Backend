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
router.get("/getFinalPoolsByStepId/:stepId", pools.getFinalPoolsByStepId);
router.get("/getRiderResults/:riderId", pools.getRiderResults);

router.post("/createPoolsByStepId/:stepId", isOrganizer, pools.createPools);
router.post(
  "/updatePoolsByStepId/:stepId",
  isOrganizer,
  pools.updatePoolsByStepId
);
router.post("/updatePoolResult/:stepId", isOrganizer, pools.updatePoolResult);

router.post("/publishResult/:stepId", isOrganizer, pools.publishResult);
router.post("/unpublishResult/:stepId", isOrganizer, pools.unpublishResult);

module.exports = router;
