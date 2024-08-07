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
    score: { type: Number, default: 0 },
    juge1: Number,
    juge2: Number,
    juge3: Number,
    rank: {
      type: Number,
    },
    isQualified: {
      type: Boolean,
      default: false,
    },
    isMissing: Boolean,
    order: Number,
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
    juge1: Joi.number(),
    juge2: Joi.number(),
    juge3: Joi.number(),
    rank: Joi.number(),
    isQualified: Joi.boolean(),
    order: Joi.number(),
    poolNumber: Joi.number().required(),
  });

  return schema.validate(result);
};
