const mongoose = require("mongoose");
const Joi = require("joi");
const { formatTypeEnum } = require("../constants/rulesEnum");

module.exports.Rules = mongoose.model(
  "Rules",
  mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    stepFormats: { type: Array, required: true },
    pointDistribution: { type: Array, required: true },
    contestId: { type: mongoose.Schema.Types.ObjectId, required: true },
  })
);

module.exports.validate = function (rules) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string(),
    stepFormats: Joi.array()
      .items(
        Joi.object({
          order: Joi.number().required(),
          formatType: Joi.string().valid(...Object.values(formatTypeEnum)),
          runTimer: Joi.number(),
          jamTimer: Joi.number(),
          bestTricksCount: Joi.number(),
        })
      )
      .min(1)
      .required(),
    pointDistribution: Joi.array().items(
      Joi.object({
        point: Joi.number().required(),
        label: Joi.string().required(),
        description: Joi.string().allow(""),
      })
    ),
    contestId: Joi.objectId().required(),
  });

  return schema.validate(rules);
};
