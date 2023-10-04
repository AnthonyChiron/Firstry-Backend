const CRUDController = require("./CRUD");
const { Contest, validate } = require("../models/contest");
const { Organizer } = require("../models/organizer");
const { checkPreferences } = require("joi");

module.exports = class ContestsController extends CRUDController {
  name = "contest";
  model = Contest;
  validate = validate;

  // Create Contest and add it to the organizer
  createContest = async (req, res) => {
    const { error } = this.validate(req.body);
    console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    console.log(req.body);
    console.log(req.user);

    const contest = new Contest({
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
      sports: req.body.sports,
      organizerId: req.user.organizerId,
    });

    try {
      const savedContest = await contest.save();
      res.send(savedContest);
    } catch (err) {
      res.status(400).send(err);
    }
  };

  // Get organizer's contests
  getOrganizerContests = async (req, res) => {
    console.log(req.user);
    const contests = await Contest.find({
      organizerId: req.user.organizerId,
    }).populate("categories");
    res.send(contests);
  };
};
