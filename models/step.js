/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const { Category } = require("./category");
const { Rules } = require("./rules");
const { Registration } = require("./registration");
const stepTypeEnum = require("../constants/stepTypeEnum");
const stepStateEnum = require("../constants/stepStateEnum");

module.exports.Step = mongoose.model(
  "Step",
  mongoose.Schema({
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
      validate: {
        isAsync: true,
        validator: async function (v) {
          return await Category.findById(v);
        },
        message: "Category not found",
      },
    },
    name: { type: String },
    isResultPublished: { type: Boolean, default: false },
    rules: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rules",
      required: true,
      validate: {
        isAsync: true,
        validator: async function (v) {
          return await Rules.findById(v);
        },
        message: "Rules not found",
      },
    },
    startDate: Date,
    endDate: Date,
    ridersPerPool: { type: Number },
    ridersQualifiedCount: { type: Number },
  })
);

module.exports.validate = function (result) {
  const schema = Joi.object({
    categoryId: Joi.objectId().required(),
    name: Joi.string()
      .valid(...Object.values(stepTypeEnum))
      .required(),
    state: Joi.string().valid(...Object.values(stepStateEnum)),
    rules: Joi.objectId().required(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    ridersPerPool: Joi.number(),
    ridersQualifiedCount: Joi.number(),
  });

  return schema.validate(result);
};
