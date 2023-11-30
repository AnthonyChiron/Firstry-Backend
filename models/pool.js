/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const { Registration } = require("./registration");
const { Step } = require("./step");

module.exports.Pool = mongoose.model(
  "Pool",
  mongoose.Schema({
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      validate: {
        isAsync: true,
        validator: async function (v) {
          return await Registration.findById(v);
        },
        message: "Registration not found",
      },
    },
    step: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Step",
      required: true,
      validate: {
        isAsync: true,
        validator: async function (v) {
          return await Step.findById(v);
        },
        message: "Step not found",
      },
    },
    score: Number,
    rank: {
      type: Number,
      required: true,
    },
    isQualified: {
      type: Boolean,
    },
    poolNumber: {
      type: Number,
      required: true,
    },
  })
);

module.exports.validate = function (result) {
  const schema = Joi.object({
    registration: Joi.objectId().required(),
    step: Joi.objectId().required(),
    score: Joi.number(),
    rank: Joi.number().required(),
    isQualified: Joi.boolean(),
    poolNumber: Joi.number().required(),
  });

  return schema.validate(result);
};
