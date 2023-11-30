const CRUDController = require("./CRUD");
const { Step, validate } = require("../models/step");

module.exports = class StepsController extends CRUDController {
  name = "step";
  model = Step;
  validate = validate;
};
