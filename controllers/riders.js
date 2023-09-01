const CRUDController = require("./CRUD");
const { Rider, validate } = require("../models/rider");

module.exports = class RidersController extends CRUDController {
  name = "rider";
  model = Rider;
  validate = validate;
};
