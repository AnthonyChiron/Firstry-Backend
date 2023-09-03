const CRUDController = require("./CRUD");
const { User, validateLogin } = require("../models/user");
const config = require("config");
const { isValid } = require("../services/hash");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

module.exports = class AuthController {
  login = async (req, res) => {
    try {
      const { error } = validateLogin(req.body.model);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await User.findOne({ email: req.body.model.email });
      if (!user) return res.status(400).send("Invalid email or password.");

      const validPassword = await isValid(
        req.body.model.password,
        user.password
      );

      if (!validPassword)
        return res.status(400).send("Invalid email or password.");

      res.send(user.generateAuthToken());
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };
};
