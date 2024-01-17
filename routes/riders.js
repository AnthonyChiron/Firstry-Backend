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
router.get("/getById/:id", riders.getById);
router.post("/", riders.post);
router.delete("/:id", isAdmin, riders.deleteById);
router.put("/:id", riders.update);

router.put(
  "/updatePhoto/:id",
  [isAuth, upload.single("photo")],
  riders.updatePhoto
);

module.exports = router;
