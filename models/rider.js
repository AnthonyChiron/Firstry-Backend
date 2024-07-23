/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const sportsEnum = require("../constants/sportsEnum");

module.exports.Rider = mongoose.model(
  "Riders",
  mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    licenceNumber: { type: String, default: "" },
    photoUrl: { type: String },
    gender: String,
    nationality: Object,
    birthDate: Date,
    city: String,
    bio: String,
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
    isVerified: { type: Boolean, default: false },
    socials: {
      instagram: String,
      twitter: String,
      youtube: String,
    },
  })
);

module.exports.validate = function (rider) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    licenceNumber: Joi.string().allow(null, ""),
    photoUrl: Joi.string(),
    gender: Joi.string().min(2),
    birthDate: Joi.date().required(),
    nationality: Joi.object().required(),
    city: Joi.string().required(),
    bio: Joi.string().allow(null, ""),
    sports: Joi.array()
      .items(Joi.string().valid(...Object.values(sportsEnum)))
      .required(),
    category: Joi.string().allow(null, ""),
    isVerified: Joi.boolean(),
    socials: Joi.object({
      instagram: Joi.string().allow(null, ""),
      twitter: Joi.string().allow(null, ""),
      youtube: Joi.string().allow(null, ""),
    }),
  });

  return schema.validate(rider);
};
