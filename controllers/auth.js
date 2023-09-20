const jwt = require("jsonwebtoken");
const hash = require("../services/hash");
const crypto = require("crypto");
const { sendEmail } = require("../services/mail");
const { User, validateSignup, validateLogin } = require("../models/user");
const _ = require("lodash");
const rolesEnum = require("../constants/rolesEnum");
const {
  Organizer,
  validate: validateOrganizer,
} = require("../models/organizer");
const { Rider, validate: validateRider } = require("../models/rider");
const functions = require("firebase-functions");
const { uploadFile } = require("../services/storage");

module.exports = class AuthController {
  signup = async (req, res) => {
    const body = JSON.parse(req.body.signUpForm);
    console.log(body.user);
    const { error } = validateSignup(body.user);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: body.user.email });
    if (emailExist) return res.status(400).send("Email already exists");

    const verifyEmailToken = crypto.randomBytes(20).toString("hex");
    const user = new User({
      email: body.user.email,
      password: await hash.encrypt(body.user.password),
      isValid: false,
      verifyEmailToken: verifyEmailToken,
      role: body.user.role,
    });

    let savedOrganizer = null;
    if (body.user.role == rolesEnum.CONTEST) {
      const reqOrganizer = body.organizer;
      const { error } = validateOrganizer(reqOrganizer);
      if (error) return res.status(400).send(error.details[0].message);
      const organizer = new Organizer(reqOrganizer);
      const photoUrlOrganizer = await uploadFile(
        req.file,
        "pdp/" + reqOrganizer.name + "_" + reqOrganizer.siretNumber
      );
      organizer.photoUrl = photoUrlOrganizer;
      savedOrganizer = await organizer.save();
      user.organizerId = savedOrganizer._id;
    }

    let savedRider = null;
    if (body.user.role == rolesEnum.RIDER) {
      const reqRider = body.rider;
      const { error } = validateRider(reqRider);
      if (error) return res.status(400).send(error.details[0].message);

      const rider = new Rider(reqRider);
      const photoUrlRider = await uploadFile(
        req.file,
        "pdp/" + reqRider.firstName + "_" + reqRider.lastName
      );
      rider.photoUrl = photoUrlRider;

      savedRider = await rider.save();
      user.riderId = savedRider._id;
      console.log(user);
    }

    try {
      const savedUser = await user.save();
      console.log(savedUser);
      let url = "";
      if (functions.config().env.type == "production")
        url =
          "https://firstry-7e136.web.app/account/validateEmail/" +
          verifyEmailToken;
      else
        url = "http://localhost:4200/account/validateEmail/" + verifyEmailToken;
      sendEmail(
        savedUser.email,
        "Firstry - Validation de votre compte",
        "Veuillez cliquer sur ce lien pour vérifier votre compte: " + url
      );
      res.send(
        JSON.stringify(this.createToken(savedUser, savedRider, savedOrganizer))
      );
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  };

  login = async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email is not found");

    // Check if password is correct
    const validPass = await hash.isValid(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid password");

    const rider = await Rider.findById(user.riderId);
    const organizer = await Organizer.findById(user.organizerId);

    res.send(JSON.stringify(this.createToken(user, rider, organizer)));
  };

  sendNewValidationEmail = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send("User not found");

    const verifyEmailToken = crypto.randomBytes(20).toString("hex");

    user.verifyEmailToken = verifyEmailToken;

    try {
      const savedUser = await user.save();

      sendEmail(
        savedUser.email,
        "Firstry - Validation de votre compte",
        "Veuillez cliquer sur ce lien pour vérifier votre compte: http://localhost:4200/account/validateEmail/" +
          verifyEmailToken
      );

      res.send(savedUser);
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  validateEmail = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send("User not found");

    console.log(req.body.token);
    console.log(user.verifyEmailToken);
    if (user.verifyEmailToken !== req.body.token)
      return res.status(400).send("Invalid token");

    user.isValid = true;

    const savedUser = await user.save();

    const rider = await Rider.findById(user.riderId);
    const organizer = await Organizer.findById(user.organizerId);

    res.send(JSON.stringify(this.createToken(savedUser, rider, organizer)));
  };

  createToken(user, rider, organizer) {
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        email: user.email,
        photoUrl: user.photoUrl,
        isValid: user.isValid,
        riderId: user.riderId,
        organizerId: user.organizerId,
        rider: rider,
        organizer: organizer,
      },
      functions.config().env.secret_token
    );
    return token;
  }
};
