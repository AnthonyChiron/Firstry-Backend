const mongoose = require("mongoose");
const Joi = require("joi");

module.exports.Contest = mongoose.model(
  "Contest",
  mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    registrationEndDate: Date,
    sports: { type: Array, required: true },
    categories: { type: Array, required: true },
    location: {
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    branding: {
      logo: String,
      banner: String,
      trailer: String,
    },
    socials: {
      instagram: String,
      twitter: String,
      youtube: String,
      website: String,
    },
  })
);

module.exports.validate = function (contest) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    registrationEndDate: Joi.date(),
    location: {
      country: Joi.string().min(2).required(),
      postalCode: Joi.string()
        .length(5)
        .regex(/^[0-9]/)
        .required(),
      city: Joi.string().min(2).required(),
      address: Joi.string().min(2).required(),
    },
    branding: {
      logo: Joi.string().uri().min(2),
      banner: Joi.string().uri().min(2),
      trailer: Joi.string().uri().min(2),
    },
    sports: Joi.array().items(Joi.string()).min(1).required(),
    categories: Joi.array().items(Joi.string()).min(1).required(),
    socials: Joi.object({
      instagram: Joi.string().min(3).pattern(new RegExp("^@")),
      twitter: Joi.string().min(3).pattern(new RegExp("^@")),
      youtube: Joi.string().min(3).pattern(new RegExp("^@")),
      website: Joi.string().uri(),
    }),
  });

  return schema.validate(contest);
};
