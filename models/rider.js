/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const sportsEnum = require("../constants/sportsEnum");

module.exports.Rider = mongoose.model(
  "Rider",
  mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: String,
    birthDate: Date,
    sports: {
      type: Array,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "A rider should have at least one sport.",
      },
      required: true,
    },
    category: String,
    socials: {
      instagram: String,
      twitter: String,
      youtube: String,
    },
  })
);

module.exports.validate = function (rider) {
  console.log(Object.values(sportsEnum));
  const schema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    gender: Joi.string().min(2),
    birthDate: Joi.date(),
    sports: Joi.array()
      .items(Joi.string().valid(...Object.values(sportsEnum)))
      .required(),
    category: Joi.string().min(2).required(),
    socials: Joi.object({
      instagram: Joi.string().min(3).pattern(new RegExp("^@")),
      twitter: Joi.string().min(3).pattern(new RegExp("^@")),
      youtube: Joi.string().min(3).pattern(new RegExp("^@")),
    }),
  });

  return schema.validate(rider);
};
