const mongoose = require("mongoose");
const Joi = require("joi");
const { Rules } = require("./rules");

module.exports.Category = mongoose.model(
  "Category",
  mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cashprize: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    sports: { type: Array, required: true },
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
    maxCompetitorCount: { type: Number, required: true },
  })
);

module.exports.validate = function (category) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
    cashprize: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    sports: Joi.array().items(Joi.string()).min(1).required(),
    rules: Joi.objectId().required(),
    maxCompetitorCount: Joi.number().required(),
  });

  return schema.validate(category);
};
