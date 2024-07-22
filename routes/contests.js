const express = require("express");
const router = express.Router();
const ContestsController = require("../controllers/contests");
const multer = require("multer");
const { isOrganizer, isAdmin } = require("../middlewares/roleGuard");

const upload = multer({ storage: multer.memoryStorage() });

const contests = new ContestsController();

// GET ALL CONTESTS
router.get("/", contests.getContests);

// GET CONTEST BY ID
router.get("/getById/:id", contests.getContestById);

// GET ORGANIZER CONTESTS
router.get("/getOrganizerContests", contests.getOrganizerContests);

// POST CONTEST
router.post("/", isOrganizer, contests.createContest);

// UPLOAD BRAND IMAGE
router.post(
  "/uploadBrandImage/:id/:type",
  upload.single("image"),
  contests.uploadBrandImage
);
router.post(
  "/uploadParentalAuthorizationFile/:id",
  upload.single("file"),
  contests.uploadParentalAuthorizationFile
);
router.post(
  "/uploadRulesFile/:id",
  upload.single("file"),
  contests.uploadRulesFile
);

// PUT CONTEST
router.put("/:id", isOrganizer, contests.update);

// DELETE CONTEST
router.delete("/:id", isOrganizer, contests.deleteById);

router.get("/publishContest/:id", isOrganizer, contests.publishContest);
router.get(
  "/isContestPublishable/:id",
  isOrganizer,
  contests.isContestPublishable
);

router.get("/getAdminStats", contests.getAdminStats);

router.put("/toggleIsFederalById/:id", isAdmin, contests.toggleIsFederalById);

module.exports = router;
