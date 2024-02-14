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
const { confirmRegisterMail } = require("../constants/mailEnum");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = class AuthController {
  signup = async (req, res) => {
    const body = JSON.parse(req.body.signUpForm);
    console.log(body);
    console.log(req.file);

    const { error } = validateSignup(body.user);
    console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: body.user.email });
    if (emailExist) return res.status(400).send("Email already exists");

    const verifyEmailToken = crypto.randomBytes(20).toString("hex");
    const user = await this.createUser(body.user, verifyEmailToken);

    let savedOrganizer = null;
    if (body.user.role == rolesEnum.ORGANIZER) {
      savedOrganizer = await this.createOrganizer(
        user.email,
        body.organizer,
        req.file
      );
      user.organizerId = savedOrganizer._id;
    }

    let savedRider = null;
    if (body.user.role == rolesEnum.RIDER) {
      savedRider = await this.createRider(body.rider, req.file);
      user.riderId = savedRider._id;
    }

    try {
      const savedUser = await user.save();
      this.sendVerificationEmail(savedUser.email, verifyEmailToken);
      res.send(
        JSON.stringify(this.createToken(savedUser, savedRider, savedOrganizer))
      );
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  };

  createUser = async (userData, verifyEmailToken) => {
    return await new User({
      email: userData.email,
      password: await hash.encrypt(userData.password),
      isValid: false,
      verifyEmailToken: verifyEmailToken,
      role: userData.role,
    });
  };

  createOrganizer = async (email, organizerData, file) => {
    const { error } = validateOrganizer(organizerData);
    console.log(error);
    if (error) throw new Error(error.details[0].message);

    const organizer = new Organizer(organizerData);
    console.log("a");
    const photoUrlOrganizer = await uploadFile(
      file,
      "pdp/" + organizerData.name + "_" + organizerData.siretNumber,
      false
    );
    organizer.photoUrl = photoUrlOrganizer;

    try {
      const account = await stripe.accounts.create({
        type: "express", // ou 'standard' selon votre choix
        country: "FR", // ou le code de pays approprié
        email: email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      organizer.stripeAccountId = account.id;
    } catch (error) {
      console.error("Erreur lors de la création du compte Stripe:", error);
      throw error; // Ou gérer l'erreur comme vous le souhaitez
    }

    return organizer.save();
  };

  createRider = async (riderData, file) => {
    const { error } = validateRider(riderData);
    console.log(error);
    if (error) throw new Error(error.details[0].message);

    const rider = new Rider(riderData);
    const photoUrlRider = await uploadFile(
      file,
      "pdp/" +
        riderData.firstName +
        "_" +
        riderData.lastName +
        "_" +
        crypto.randomBytes(5).toString("hex"),
      true
    );
    rider.photoUrl = photoUrlRider;
    return rider.save();
  };

  sendVerificationEmail = (email, verifyEmailToken) => {
    sendEmail(
      email,
      "Firstry - Validation de votre compte",
      confirmRegisterMail(verifyEmailToken)
    );
  };

  login = async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email is not found");

    // Check if password is correct
    const validPass = await hash.isValid(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid password");

    let rider;
    let organizer;
    if (user.role == rolesEnum.RIDER) {
      rider = await Rider.findById(user.riderId);
      organizer = null;
    } else {
      organizer = await Organizer.findById(user.organizerId);
      rider = null;
    }

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
    console.log(rider);
    console.log(user);
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
      process.env.JWT_SECRET_TOKEN
    );
    return token;
  }
};
