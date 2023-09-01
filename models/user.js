/** @type {import("mongoose:Model")} */
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

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
  password: { type: String, required: true },
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

module.exports.User = mongoose.model("User", UserSchema);

module.exports.validate = function (user) {
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
