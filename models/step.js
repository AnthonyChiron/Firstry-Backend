/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const { Category } = require("./category");
const { Rules } = require("./rules");
const { Registration } = require("./registration");
const stepTypeEnum = require("../constants/stepTypeEnum");

module.exports.Step = mongoose.model(
  "Step",
  mongoose.Schema({
    category: {
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
    name: { type: String, required: true },
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
  })
);

module.exports.validate = function (result) {
  const schema = Joi.object({
    category: Joi.objectId().required(),
    name: Joi.string()
      .valid(...Object.values(stepTypeEnum))
      .required(),
    rules: Joi.objectId().required(),
    startDate: Joi.date(),
    endDate: Joi.date(),
  });

  return schema.validate(result);
};
