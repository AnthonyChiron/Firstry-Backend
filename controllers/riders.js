const CRUDController = require("./CRUD");
const { Rider, validate } = require("../models/rider");

module.exports = class RiderController extends CRUDController {
  name = "rider";
  model = Rider;
  validate = validate;
};
