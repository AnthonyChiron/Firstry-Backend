const mongoose = require("mongoose");
const Joi = require("joi");
const { formatEnum } = require("../constants/rulesEnum");

module.exports.Rules = mongoose.model(
  "Rules",
  mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    format: { type: String, required: true },
    pointDistribution: { type: Array, required: true },
    competitorPerPool: { type: Number },
    jamTimer: { type: Number },
    runTimer: { type: Number },
  })
);

module.exports.validate = function (rules) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string(),
    format: Joi.string()
      .valid(...Object.values(formatEnum))
      .required(),
    pointDistribution: Joi.array()
      .items(
        Joi.object({
          point: Joi.number().required(),
          label: Joi.string().required(),
          description: Joi.string().allow(""),
        })
      )
      .min(1)
      .required(),
    competitorPerPool: Joi.number(),
    jamTimer: Joi.number(),
    runTimer: Joi.number(),
  });

  return schema.validate(rules);
};
