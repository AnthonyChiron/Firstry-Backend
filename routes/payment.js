const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment");

const payment = new PaymentController();

router.post("/createRegistrationPayment", payment.createRegistrationPayment);
router.get("/createOnboardingLink/:accountId", payment.createOnboardingLink);
router.get("/createLoginLink/:accountId", payment.createLoginLink);
router.get("/isStripeAccountUsable/:accountId", payment.isStripeAccountUsable);

module.exports = router;