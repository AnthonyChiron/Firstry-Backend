const express = require("express");
const router = express.Router();
const OrganizersController = require("../controllers/organizers");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const organizers = new OrganizersController();

// CRUD
router.get("/", organizers.getAll);
router.get("/getById/:id", organizers.getById);
router.post("/", organizers.post);
router.delete("/:id", organizers.deleteById);
router.put("/:id", organizers.update);
router.get("/getAdminStats", organizers.getAdminStats);

router.put("/updatePhoto/:id", upload.single("photo"), organizers.updatePhoto);
router.get(
  "/isContestPaymentEnabledByOrganizerId/:id",
  organizers.isContestPaymentEnabledByOrganizerId
);
router.get(
  "/isOrganizerContest/:organizerId/:contestId",
  organizers.IsOrganizerContest
);

module.exports = router;
