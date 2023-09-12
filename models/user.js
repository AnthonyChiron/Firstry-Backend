/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const rolesEnum = require("../constants/rolesEnum");

const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const UserSchema = mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    unique: true,
    required: true,
  },
  isValid: Boolean,
  role: { type: String, enum: rolesEnum, required: true },
});

module.exports.User = mongoose.model("User", UserSchema);

module.exports.validateRegister = function (user) {
  const schema = Joi.object({
    googleId: Joi.string().required(),
    email: Joi.string().email().required(),
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
      .minOfSpecialCharacters(2)
      .minOfLowercase(2)
      .minOfUppercase(2)
      .minOfNumeric(2)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .required(),
  });
  return schema.validate(user);
};
