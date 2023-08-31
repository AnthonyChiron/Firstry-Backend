/** @type {import("mongoose")} */
const mongoose = require("mongoose");
const Joi = require("joi");

module.exports.Contest = mongoose.model(
  "Contest",
  mongoose.Schema({
    name: String,
    description: String,
    city: String,
    address: String,
    startDate: Date,
    endDate: Date,
    sports: Array,
    categories: Array,
    socials: {
      instagram: String,
      twitter: String,
      youtube: String,
    },
  })
);

module.exports.validate = function (contest) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
    city: Joi.string().min(2).required(),
    address: Joi.string().min(2).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    sports: Joi.array().items(Joi.string()).required(),
    categories: Joi.array().items(Joi.string()).required(),
    socials: Joi.object({
      instagram: Joi.string().min(3).pattern(new RegExp("^@")),
      twitter: Joi.string().min(3).pattern(new RegExp("^@")),
      youtube: Joi.string().min(3).pattern(new RegExp("^@")),
    }),
  });

  return schema.validate(contest);
};
