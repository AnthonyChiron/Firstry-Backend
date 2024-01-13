const express = require("express");
const router = express.Router();
const RegistrationsController = require("../controllers/registrations");

const registrations = new RegistrationsController();

// CRUD
router.get("/", registrations.getAll);
router.get("/getById/:id", registrations.getById);
router.post("/", registrations.post);
router.put("/:id", registrations.update);
router.delete("/:id", registrations.deleteById);

router.get(
  "/validRiderRegistration/:riderId/:categoryId",
  registrations.validRiderRegistration
);

router.get(
  "/cancelRiderRegistration/:riderId/:categoryId",
  registrations.cancelRiderRegistration
);

router.get(
  "/refuseRiderRegistration/:riderId/:categoryId",
  registrations.refuseRiderRegistration
);

router.get(
  "/pendingApprovalRiderRegistration/:riderId/:categoryId",
  registrations.pendingApprovalRiderRegistration
);

router.get(
  "/paymentFailedRiderRegistration/:riderId/:categoryId",
  registrations.paymentFailedRiderRegistration
);

router.get(
  "/getRiderRegistrations/:riderId",
  registrations.getRiderRegistrations
);

router.get(
  "/isRiderRegisteredToContest/:riderId/:contestId",
  registrations.isRiderRegisteredToContest
);

module.exports = router;
