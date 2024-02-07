const express = require("express");
const router = express.Router();
const RidersController = require("../controllers/riders");
const multer = require("multer");
const { isOrganizer, isAdmin } = require("../middlewares/roleGuard");
const { isAuth } = require("../middlewares/authGuard");
const upload = multer({ storage: multer.memoryStorage() });

const riders = new RidersController();

// CRUD
router.get("/", riders.getAll);
router.get("/getByPage/:page/:limit", riders.getAllByPage);
router.get(
  "/getFilteredRidersByPage/:page/:limit",
  riders.getFilteredRidersByPage
);
router.get("/getById/:id", riders.getById);
router.get("/getAdminStats", riders.getAdminStats);
router.post("/", riders.post);
router.delete("/:id", isAdmin, riders.deleteById);
router.put("/:id", riders.update);

router.put(
  "/updatePhoto/:id",
  [isAuth, upload.single("photo")],
  riders.updatePhoto
);

module.exports = router;
