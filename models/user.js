/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const rolesEnum = require("../constants/rolesEnum");

const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    unique: true,
    required: true,
  },
  newEmail: {
    type: String,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  newPassword: {
    type: String,
  },
  isValid: Boolean,
  verifyEmailToken: String,
  verifyNewEmailToken: String,
  verifyNewPasswordToken: String,
  resetPasswordToken: String,
  role: { type: String, enum: rolesEnum, required: true },
  photoUrl: { type: String },
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider",
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
  },
});

module.exports.User = mongoose.model("User", UserSchema);

module.exports.validateSignup = function (user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    newEmail: Joi.string().email(),
    password: joiPassword
      .string()
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .required(),
    newPassword: joiPassword.string().noWhiteSpaces().onlyLatinCharacters(),
    isValid: Joi.boolean(),
    role: Joi.string()
      .valid(...Object.values(rolesEnum))
      .required(),
    rider: Joi.object(),
    riderId: Joi.objectId(),
    organizer: Joi.object(),
    organizerId: Joi.objectId(),
  });
  return schema.validate(user);
};

module.exports.validateLogin = function (user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: joiPassword
      .string()
      .minOfNumeric(2)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .required(),
  });
  return schema.validate(user);
};
