const CRUDController = require("./CRUD");
const crypto = require("crypto");
const { User, validateRegister } = require("../models/user");
const hash = require("../services/hash");
const { mailSubjectsEnum, mailContentEnum } = require("../constants/mailEnum");
const mailService = require("../services/mail");
const _ = require("lodash");

module.exports = class UsersController extends CRUDController {
  name = "user";
  model = User;
  validate = validateRegister;

  register = async (req, res) => {
    const { error } = this.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    const model = new User(req.body);
    const newUser = await model.save();

    res.send(newUser);
  };

  updateEmail = async (req, res) => {
    // Vérifie que l'utilisateur existe
    console.log(req.params.id);
    console.log(req.body);
    const user = await this.model.findById(req.params.id);
    if (!user) return res.status(404).send("User not found.");

    // Créer un token de vérification
    const verifyEmailToken = crypto.randomBytes(20).toString("hex");

    console.log(verifyEmailToken);
    user.newEmail = req.body.newEmail;
    user.verifyNewEmailToken = verifyEmailToken;

    console.log(user);
    user.save();

    // Envoie un mail de confirmation de mail
    mailService.sendEmail(
      user.newEmail,
      mailSubjectsEnum.NEW_EMAIL_CONFIRMATION,
      mailContentEnum.NEW_EMAIL_CONFIRMATION +
        "https://firstry.fr/account/validateNewEmail/" +
        verifyEmailToken
    );

    res.send(user);
  };

  updatePassword = async (req, res) => {
    // Vérifie que l'utilisateur existe
    const user = await this.model.findById(req.params.id);
    if (!user) return res.status(404).send("User not found.");

    // Créer un token de vérification
    const verifyNewPasswordToken = crypto.randomBytes(20).toString("hex");

    console.log(req.body.newPassword);
    user.newPassword = await hash.encrypt(req.body.newPassword);
    user.verifyNewPasswordToken = verifyNewPasswordToken;

    user.save();

    // Envoie un mail de confirmation de mail
    mailService.sendEmail(
      user.email,
      mailSubjectsEnum.NEW_PASSWORD_CONFIRMATION,
      mailContentEnum.NEW_PASSWORD_CONFIRMATION +
        "https://firstry.fr/account/validateNewPassword/" +
        verifyNewPasswordToken
    );

    res.send(user);
  };

  isEmailAvailable = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(200).send(false);
    return res.status(200).send(true);
  };

  validateNewEmail = async (req, res) => {
    console.log(req.params.token);
    const user = await this.model.findOne({
      verifyNewEmailToken: req.params.token,
    });
    if (!user) return res.status(400).send("Invalid token");

    user.email = user.newEmail;
    user.newEmail = null;
    user.verifyNewEmailToken = null;

    user.save();

    res.send(user);
  };

  validateNewPassword = async (req, res) => {
    const user = await this.model.findOne({
      verifyNewPasswordToken: req.params.token,
    });
    if (!user) return res.status(400).send("Invalid token");

    user.password = user.newPassword;
    user.newPassword = null;
    user.verifyNewPasswordToken = null;

    user.save();

    res.send(user);
  };

  resetPassword = async (req, res) => {
    console.log(req.body);
    const user = await this.model.findOne({
      email: req.body.email,
    });
    if (!user) return res.status(400).send("Invalid email");

    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetPasswordToken;

    user.save();

    mailService.sendEmail(
      user.email,
      mailSubjectsEnum.RESET_PASSWORD,
      mailContentEnum.RESET_PASSWORD +
        "https://firstry.fr/account/resetPassword/" +
        resetPasswordToken
    );

    res.send(user);
  };

  validateResetPassword = async (req, res) => {
    const user = await this.model.findOne({
      resetPasswordToken: req.params.token,
    });
    if (!user) return res.status(400).send("Invalid token");

    user.password = await hash.encrypt(req.body.newPassword);
    user.verifyNewPasswordToken = null;

    user.save();

    res.send(user);
  };

  checkResetPasswordToken = async (req, res) => {
    const user = await this.model.findOne({
      resetPasswordToken: req.params.token,
    });
    if (!user) return res.status(400).send("Invalid token");

    res.send(user);
  };
};
