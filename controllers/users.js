const CRUDController = require("./CRUD");
const { User, validate } = require("../models/user");
const { encrypt } = require("../services/hash");
const _ = require("lodash");

module.exports = class UsersController extends CRUDController {
  name = "user";
  model = User;
  validate = validate;

  register = async (req, res) => {
    try {
      const { error } = this.validate(req.body.model);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await User.findOne({ email: req.body.model.email });
      if (user) return res.status(400).send("User already registered.");

      const model = new User(req.body.model);
      model.password = await encrypt(model.password);

      const newUser = await model.save();

      res
        .header("x-auth-token", newUser.generateAuthToken())
        .send(_.pick(newUser, ["_id", "name", "email"]));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };
};
