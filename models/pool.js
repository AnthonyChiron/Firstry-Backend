/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const { Contest } = require("./contest");
const { Registration } = require("./registration");

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
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
      validate: {
        isAsync: true,
        validator: async function (v) {
          return await Contest.findById(v);
        },
        message: "Contest not found",
      },
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
    pool: {
      type: Number,
      required: true,
    },
  })
);

module.exports.validate = function (result) {
  const schema = Joi.object({
    registration: Joi.objectId().required(),
    contest: Joi.objectId().required(),
    score: Joi.number(),
    rank: Joi.number().required(),
    step: Joi.string().valid("Qualification", "Finale").required(),
    isQualified: Joi.boolean(),
    pool: Joi.number().required(),
  });

  return schema.validate(result);
};
