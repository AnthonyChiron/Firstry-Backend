const CRUDController = require("./CRUD");
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
    const user = await this.model.findById(req.body.model.id);
    if (!user) return res.status(404).send("User not found.");

    user.newEmail = req.body.model.newEmail;

    user.save();
    // Envoie un mail de confirmation de mail
    mailService.sendEmail(
      user.email,
      mailSubjectsEnum.NEW_MAIL_CONFIRMATION,
      mailContentEnum.NEW_MAIL_CONFIRMATION,
      "<h2>Test</h2>"
    );
  };

  getUserByGoogleId = async (req, res) => {
    const user = await this.model.findOne({ googleId: req.params.googleId });
    if (!user) return res.status(404).send("User not found.");

    res.send(user);
  };

  test = async (req, res) => {
    mailService.sendEmail(
      "anthony.chiron@outlook.fr",
      "Test de mail",
      "Ceci est un test de mail",
      ""
    );
    res.send("OK");
  };

  isEmailAvailable = async (req, res) => {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(200).send(false);
    return res.status(200).send(true);
  };
};
