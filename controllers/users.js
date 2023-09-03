const CRUDController = require("./CRUD");
const { User, validate } = require("../models/user");
const { encrypt } = require("../services/hash");
const { mailSubjectsEnum, mailContentEnum } = require("../constants/mailEnum");
const mailService = require("../services/mail");
const _ = require("lodash");

module.exports = class UsersController extends CRUDController {
  name = "user";
  model = User;
  validate = validate;

  register = async (req, res) => {
    const { error } = this.validate(req.body.model);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.model.email });
    if (user) return res.status(400).send("User already registered.");

    const model = new User(req.body.model);
    model.password = await encrypt(model.password);

    const newUser = await model.save();

    res
      .header("x-auth-token", newUser.generateAuthToken())
      .send(_.pick(newUser, ["_id", "name", "email", "role"]));
  };

  me = async (req, res) => {
    const currentUser = await this.model
      .findById(req.user._id)
      .select("-password");
    res.send(currentUser);
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

  validateEmail = async (req, res) => {
    // Vérifie que l'utilisateur existe
    const user = await this.model.findById(req.body.model.id);
    if (!user) return res.status(404).send("User not found.");

    user.isValid = true;

    res.send("Email has been validate.");
  };

  resetPassword = async (req, res) => {
    // Vérifie que l'utilisateur existe
    const user = await this.model.findOne({ email: req.body.model.email });
    if (!user) return res.status(404).send("User doesn't exist.");

    // Envoie un mail de réinitialisation de mdp
    mailService.sendEmail(
      user.email,
      mailSubjectsEnum.RESET_PASSWORD,
      mailContentEnum.RESET_PASSWORD,
      ""
    );

    res.send("Reset password mail sent !");
  };
};
