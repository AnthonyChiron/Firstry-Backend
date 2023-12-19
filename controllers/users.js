const CRUDController = require("./CRUD");
const crypto = require("crypto");
const { User, validateRegister } = require("../models/user");
const { encrypt } = require("../services/hash");
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
      user.email,
      mailSubjectsEnum.NEW_EMAIL_CONFIRMATION,
      mailContentEnum.NEW_EMAIL_CONFIRMATION +
        '<a href="https://firstry.com/verifyNewEmail/' +
        verifyEmailToken +
        '">https://firstry.com/verifyNewEmail/' +
        verifyEmailToken +
        "</a>"
    );

    res.send(user);
  };

  updatePassword = async (req, res) => {
    // Vérifie que l'utilisateur existe
    const user = await this.model.findById(req.params.id);
    if (!user) return res.status(404).send("User not found.");

    // Créer un token de vérification
    const verifyNewPasswordToken = crypto.randomBytes(20).toString("hex");

    user.newPassword = await encrypt(req.body.newPassword);
    user.verifyNewPasswordToken = verifyNewPasswordToken;

    user.save();

    // Envoie un mail de confirmation de mail
    mailService.sendEmail(
      user.email,
      mailSubjectsEnum.NEW_PASSWORD_CONFIRMATION,
      mailContentEnum.NEW_PASSWORD_CONFIRMATION +
        '<a href="https://firstry.com/verifyNewPassword/' +
        verifyNewPasswordToken +
        '">https://firstry.com/verifyNewPassword/' +
        verifyNewPasswordToken +
        "</a>"
    );

    res.send(user);
  };

  isEmailAvailable = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(200).send(false);
    return res.status(200).send(true);
  };
};
