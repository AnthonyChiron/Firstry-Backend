const express = require("express");
const router = express.Router();
const ContestsController = require("../controllers/contests");
const currentUser = require("../middlewares/currentUser");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const contests = new ContestsController();

// GET ALL CONTESTS
router.get("/", contests.getContests);

// GET CONTEST BY ID
router.get("/getById/:id", contests.getById);

// GET ORGANIZER CONTESTS
router.get("/getOrganizerContests", contests.getOrganizerContests);

// POST CONTEST
router.post("/", contests.createContest);

// UPLOAD BRAND IMAGE
router.post(
  "/uploadBrandImage/:id",
  upload.single("image"),
  contests.uploadBrandImage
);

// PUT CONTEST
router.put("/:id", contests.update);

// DELETE CONTEST
router.delete("/:id", contests.deleteById);

module.exports = router;
