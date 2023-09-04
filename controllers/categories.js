const CRUDController = require("./CRUD");
const { Category, validate } = require("../models/category");

module.exports = class CategoriesController extends CRUDController {
  name = "category";
  model = Category;
  validate = validate;
};
