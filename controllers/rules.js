const CRUDController = require("./CRUD");
const { Rules, validate } = require("../models/rules");

module.exports = class RulesController extends CRUDController {
  name = "rules";
  model = Rules;
  validate = validate;
};
