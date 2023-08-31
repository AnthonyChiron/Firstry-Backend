const { Contest, validate } = require("../models/contest");

module.exports.createContest = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const contest = new Contest({
      name: req.body.name,
      description: req.body.description,
      city: req.body.city,
      address: req.body.city,
      startDate: req.body.date,
      endDate: req.body.date,
      sports: req.body.sports,
      categories: req.body.category,
      socials: req.body.socials,
    });

    const savedContest = await contest.save();
    res.send(savedContest);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.deleteContestById = async (req, res) => {
  try {
    const result = await Contest.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).send("Contest not found");
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.updateContest = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await Contest.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      res.status(404).send("Contest not found");
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

module.exports.getContestById = async (req, res) => {
  try {
    const result = await Contest.findById(req.params.id);
    if (!result) {
      res.status(404).send("Contest not found");
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find();
    res.send(contests);
  } catch (error) {
    res.status(400).send(error);
  }
};
