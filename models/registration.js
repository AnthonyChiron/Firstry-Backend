const mongoose = require("mongoose");
const Joi = require("joi");
const { Rider } = require("./rider");
const { Category } = require("./category");

module.exports.Registration = mongoose.model(
  "Registration",
  mongoose.Schema({
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      required: true,
      validate: {
        isAsync: true,
        validator: async function (v) {
          return await Rider.findById(v);
        },
        message: "Rider not found",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      validate: {
        isAsync: true,
        validator: async function (v) {
          return await Category.findById(v);
        },
        message: "Category not found",
      },
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    state: String,
  })
);

module.exports.validate = function (registration) {
  const schema = Joi.object({
    rider: Joi.objectId().required(),
    category: Joi.objectId().required(),
  });

  return schema.validate(registration);
};
