/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const sportsEnum = require("../constants/sportsEnum");

module.exports.Rider = mongoose.model(
  "Rider",
  mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photoUrl: { type: String },
    gender: String,
    nationality: Object,
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
  const schema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    photoUrl: Joi.string(),
    gender: Joi.string().min(2),
    birthDate: Joi.date().required(),
    nationality: Joi.object().required(),
    city: Joi.string().min(2).required(),
    sports: Joi.array()
      .items(Joi.string().valid(...Object.values(sportsEnum)))
      .required(),
    category: Joi.string().min(2),
    socials: Joi.object({
      instagram: Joi.string().min(3).pattern(new RegExp("^@")),
      twitter: Joi.string().min(3).pattern(new RegExp("^@")),
      youtube: Joi.string().min(3).pattern(new RegExp("^@")),
    }),
  });

  return schema.validate(rider);
};
