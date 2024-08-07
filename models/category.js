const mongoose = require("mongoose");
const Joi = require("joi");
const { Rules } = require("./rules");
const stepFormatEnum = require("../constants/stepFormatEnum");

module.exports.Category = mongoose.model(
  "Category",
  mongoose.Schema({
    name: { type: String, required: true },
    shortName: { type: String },
    description: { type: String },
    isFederal: { type: Boolean, default: false },
    cashprize: { type: String },
    sports: { type: Array, required: true },
    maxRiders: { type: Number, required: true },
    registerPrice: { type: Number, required: true },
    isParentalAuthorizationRequired: { type: Boolean },
    isQualificationStep: { type: Boolean },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
  })
);

module.exports.validate = function (category) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    shortName: Joi.string().allow(null, ""),
    description: Joi.string().allow(null, ""),
    isFederal: Joi.boolean(),
    cashprize: Joi.string(),
    sports: Joi.array().items(Joi.string()).min(1).required(),
    maxRiders: Joi.number().required(),
    registerPrice: Joi.number().required(),
    isQualificationStep: Joi.boolean(),
    isParentalAuthorizationRequired: Joi.boolean(),
    contestId: Joi.objectId().required(),
  });

  return schema.validate(category);
};
