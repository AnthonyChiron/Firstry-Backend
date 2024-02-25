const CRUDController = require("./CRUD");
const { Rules, validate } = require("../models/rules");

module.exports = class RulesController extends CRUDController {
  name = "rules";
  model = Rules;
  validate = validate;

  getRulesByContestId = async (req, res) => {
    // Get rules by contest id or rules isDefault = true
    const rules = await Rules.find({
      $or: [{ contestId: req.params.id }, { isDefault: true }],
    });

    res.send(rules);
  };
};
