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
  password: {
    type: String,
    required: true,
  },
  isValid: Boolean,
  verifyEmailToken: String,
  role: { type: String, enum: rolesEnum, required: true },
});

module.exports.User = mongoose.model("User", UserSchema);

module.exports.validateSignup = function (user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: joiPassword
      .string()
      .minOfNumeric(2)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .required(),
    isValid: Joi.boolean(),
    role: Joi.string()
      .valid(...Object.values(rolesEnum))
      .required(),
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
