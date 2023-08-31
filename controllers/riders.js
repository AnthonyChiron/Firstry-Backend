const { Rider, validate } = require("../models/rider");

module.exports.createRider = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rider = new Rider({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
      sports: req.body.sports,
      category: req.body.category,
      socials: req.body.socials,
    });

    const savedRider = await rider.save();
    res.send(savedRider);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.deleteRiderById = async (req, res) => {
  try {
    const result = await Rider.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).send("Rider not found");
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.updateRider = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await Rider.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      res.status(404).send("Rider not found");
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

module.exports.getRiderById = async (req, res) => {
  try {
    const result = await Rider.findById(req.params.id);
    if (!result) {
      res.status(404).send("Rider not found");
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find();
    res.send(riders);
  } catch (error) {
    res.status(400).send(error);
  }
};
