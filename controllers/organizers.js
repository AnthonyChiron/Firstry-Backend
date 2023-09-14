const CRUDController = require("./CRUD");
const { Organizer, validate } = require("../models/organizer");

module.exports = class OrganizersController extends CRUDController {
  name = "organizer";
  model = Organizer;
  validate = validate;
};
