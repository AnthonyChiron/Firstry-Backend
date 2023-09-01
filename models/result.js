/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports.Result = mongoose.model(
  "Result",
  mongoose.Schema({
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      required: true,
    },
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    score: Number,
    rank: {
      type: Number,
      required: true,
    },
    step: {
      type: String,
      enum: ["Qualification", "Finale"],
      required: true,
    },
    isQualified: {
      type: Boolean,
    },
  })
);

module.exports.validate = function (result) {
  const schema = Joi.object({
    rider: Joi.objectId().required(),
    contest: Joi.objectId().required(),
    score: Joi.number(),
    rank: Joi.number().required(),
    step: Joi.string().valid("Qualification", "Finale").required(),
    isQualified: Joi.boolean(),
  });

  return schema.validate(result);
};
