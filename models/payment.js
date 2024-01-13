const mongoose = require("mongoose");
const Joi = require("joi");
const { Rules } = require("./rules");
const stepFormatEnum = require("../constants/stepFormatEnum");

module.exports.Payment = mongoose.model(
  "Payment",
  mongoose.Schema({
    userId: { type: String, required: true },
    stripeAccountId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentIntentId: { type: String, required: true },
    paymentState: { type: String, required: true },
    chargeId: { type: String },
    failedMessage: { type: String },
  })
);
