const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment");

const payment = new PaymentController();

router.post("/createpayment", payment.createPayment);
router.get("/createLoginLink/:id", payment.createLoginLink);

module.exports = router;
