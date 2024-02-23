const express = require("express");
const router = express.Router();
const RegistrationsController = require("../controllers/registrations");
const { isOrganizer } = require("../middlewares/roleGuard");

const registrations = new RegistrationsController();

// CRUD
router.get("/", registrations.getAll);
router.get("/getById/:id", registrations.getById);
router.post("/", registrations.post);
router.put("/:id", registrations.update);
router.delete("/:id", registrations.deleteById);

router.get(
  "/validRiderRegistration/:registrationId",
  isOrganizer,
  registrations.validRiderRegistration
);

router.get(
  "/cancelRiderRegistration/:registrationId",
  registrations.cancelRiderRegistration
);

router.get(
  "/refuseRiderRegistration/:registrationId",
  registrations.refuseRiderRegistration
);

router.get(
  "/pendingApprovalRiderRegistration/:registrationId",
  registrations.pendingApprovalRiderRegistration
);

router.get(
  "/paymentFailedRiderRegistration/:registrationId",
  registrations.paymentFailedRiderRegistration
);

router.get(
  "/refundRiderRegistration/:registrationId",
  registrations.refundRiderRegistration
);

router.get(
  "/getRiderRegistrations/:riderId",
  registrations.getRiderRegistrations
);

router.get(
  "/isRiderRegisteredToContest/:riderId/:contestId",
  registrations.isRiderRegisteredToContest
);

router.get(
  "/getRegistrationsByContestId/:contestId",
  registrations.getRegistrationsByContestId
);

module.exports = router;
