/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");

module.exports.Organizer = mongoose.model(
  "Organizer",
  mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String },
    photoUrl: { type: String },
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
    socials: Joi.object({
      instagram: Joi.string().min(3).pattern(new RegExp("^@")),
      twitter: Joi.string().min(3).pattern(new RegExp("^@")),
      youtube: Joi.string().min(3).pattern(new RegExp("^@")),
    }),
  });

  return schema.validate(organizer);
};
