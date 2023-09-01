const CRUDController = require("./CRUD");
const { Result, validate } = require("../models/result");

module.exports = class ResultsController extends CRUDController {
  name = "result";
  model = Result;
  validate = validate;
};
