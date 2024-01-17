const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment");
const { isAuth } = require("../middlewares/authGuard");

const payment = new PaymentController();

router.post(
  "/createRegistrationPayment",
  isAuth,
  payment.createRegistrationPayment
);
router.get(
  "/createOnboardingLink/:accountId",
  isAuth,
  payment.createOnboardingLink
);
router.get("/createLoginLink/:accountId", isAuth, payment.createLoginLink);
router.get(
  "/isStripeAccountUsable/:accountId",
  isAuth,
  payment.isStripeAccountUsable
);

module.exports = router;
