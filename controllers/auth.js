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
const { uploadImg } = require("../services/storage");
const {
  confirmRegisterMail,
  newEmailConfirmationMail,
} = require("../constants/mailEnum");
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
    const photoUrlOrganizer = await uploadImg(
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
    let photoUrlRider =
      "https://storage.googleapis.com/firstry-7e136.appspot.com/production/pdp/Anthony_CHIRON_2024-02-17T11%3A13%3A47.712Z.webp?GoogleAccessId=firebase-adminsdk-v4ylh%40firstry-7e136.iam.gserviceaccount.com&Expires=16447017600&Signature=P6RTB9JACigUz6Pi1O9%2BRNZEXtxX950lVLGV2E%2FMt5OeZa3hNOB3F2dOoL0YIpo3vSGZmh3Z13gYhiYFinwvWRyl2FqeKjdIMhMUo9ij6lEEnLr%2FaqB%2F4Is7Cc%2FWvA0UARVxoFrkmukFZIh7EOIFvW3Zxy6dGwzNCum0AggfMiisKiCx0G9J0uyKBfcXSju595qMT1335DxePrpZnqRU0nrZlB8Mrv3upF%2FtYtM0i%2BU5ACyHymvp%2FLgXneLz7aeWkj6Apnc8c8y634wT%2FkZR0jMVRqvmx9j970Yrt3hvjHvzZRafMIo%2BkAe9MGIH79ah0sP9%2BoTE7l6uJ%2F4DITculw%3D%3D";
    if (file)
      photoUrlRider = await uploadImg(
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
        newEmailConfirmationMail(verifyEmailToken)
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
