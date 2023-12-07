const CRUDController = require("./CRUD");
const { Rules, validate } = require("../models/rules");

module.exports = class RulesController extends CRUDController {
  name = "rules";
  model = Rules;
  validate = validate;

  getRulesByContestId = async (req, res) => {
    const rules = await this.model.find({ contestId: req.params.id });
    res.send(rules);
  };
};
