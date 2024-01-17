/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");

module.exports.Organizer = mongoose.model(
  "Organizer",
  mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String },
    photoUrl: { type: String },
    location: {
      country: { type: String },
      postalCode: { type: String },
      city: { type: String },
      address: { type: String },
    },
    socials: {
      instagram: String,
      twitter: String,
      youtube: String,
    },
    stripeAccountId: { type: String },
  })
);

module.exports.validate = function (organizer) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    bio: Joi.string(),
    photoUrl: Joi.string().uri().min(2),
    location: {
      country: Joi.string().allow(""),
      postalCode: Joi.string().allow(""),
      city: Joi.string().allow(""),
      address: Joi.string().allow(""),
    },
    socials: Joi.object({
      instagram: Joi.string().min(3).pattern(new RegExp("^@")),
      twitter: Joi.string().min(3).pattern(new RegExp("^@")),
      youtube: Joi.string().min(3).pattern(new RegExp("^@")),
    }),
  });

  return schema.validate(organizer);
};
