const CRUDController = require("./CRUD");
const { Pool, validate } = require("../models/pool");

module.exports = class PoolsController extends CRUDController {
  name = "pool";
  model = Pool;
  validate = validate;
};
