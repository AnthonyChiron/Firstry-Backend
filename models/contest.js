const mongoose = require("mongoose");
const Joi = require("joi");

module.exports.Contest = mongoose.model(
  "Contest",
  mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: Date,
    endDate: Date,
    registrationEndDate: Date,
    sports: { type: Array },
    enablePayment: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    isValidatedByAdmin: { type: Boolean, default: false },
    isFederal: { type: Boolean, default: false },
    federalRegistrationLink: { type: String },
    parentalAuthorizationFileUrl: {
      type: String,
    },
    rulesFileUrl: {
      type: String,
    },
    location: {
      country: { type: String },
      postalCode: { type: String },
      city: { type: String },
      address: { type: String },
    },
    branding: {
      logo: String,
      banner: String,
      poster: String,
      trailer: String,
    },
    socials: {
      instagram: String,
      twitter: String,
      youtube: String,
      website: String,
    },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "Organizer" },
  })
);

module.exports.validate = function (contest) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(2),
    type: Joi.string().allow(null, ""),
    startDate: Joi.date(),
    endDate: Joi.date(),
    registrationEndDate: Joi.date(),
    location: {
      country: Joi.string().allow(null, ""),
      postalCode: Joi.string().allow(null, ""),
      city: Joi.string().allow(null, ""),
      address: Joi.string().allow(null, ""),
    },
    branding: {
      logo: Joi.string().uri().min(2),
      banner: Joi.string().uri().min(2),
      poster: Joi.string().uri().min(2),
      trailer: Joi.string().uri().min(2),
    },
    sports: Joi.array().items(Joi.string()).min(1),
    enablePayment: Joi.boolean().required(),
    isPublished: Joi.boolean(),
    isValidatedByAdmin: Joi.boolean(),
    isFederal: Joi.boolean(),
    federalRegistrationLink: Joi.string().uri().allow(null, ""),
    parentalAuthorizationUrl: Joi.string().uri().allow(null, ""),
    socials: Joi.object({
      instagram: Joi.string().allow(null, ""),
      twitter: Joi.string().allow(null, ""),
      youtube: Joi.string().allow(null, ""),
      website: Joi.string().allow(null, "").uri(),
    }),
    organizerId: Joi.objectId(),
  });

  return schema.validate(contest);
};
