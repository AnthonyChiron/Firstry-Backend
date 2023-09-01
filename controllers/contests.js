const CRUDController = require("./CRUD");
const { Contest, validate } = require("../models/contest");

module.exports = class ContestsController extends CRUDController {
  name = "contest";
  model = Contest;
  validate = validate;
};
