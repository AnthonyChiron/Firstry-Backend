const CRUDController = require("./CRUD");
const { Registration, validate } = require("../models/registration");

module.exports = class CategoriesController extends CRUDController {
  name = "registration";
  model = Registration;
  validate = validate;
};
