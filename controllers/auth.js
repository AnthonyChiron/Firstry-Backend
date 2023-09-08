const CRUDController = require("./CRUD");
const { User, validateLogin } = require("../models/user");
const config = require("config");
const { isValid } = require("../services/hash");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

module.exports = class AuthController {
  login = async (req, res) => {
    console.log(req.body);
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");

    const validPassword = await isValid(req.body.password, user.password);

    if (!validPassword)
      return res.status(400).send("Invalid email or password.");
    const token = user.generateAuthToken();

    res.send({ token: token });
  };
};
