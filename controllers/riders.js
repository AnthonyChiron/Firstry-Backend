/** @type {import("mongoose").Model} */
const Rider = require("../models/riders");

// Create rider in db
module.exports.createRider = async function (data) {
  const rider = new Rider({
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    birthDate: data.birthDate,
    sports: data.sports,
    category: data.category,
    socials: data.socials,
  });

  return await rider.save();
};

// Delete rider in db
module.exports.deleteRiderById = async function (id) {
  return await Rider.findByIdAndDelete(id);
};

// Update rider in db
module.exports.updateRider = async function (id, data) {
  const rider = new Rider({
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    birthDate: data.birthDate,
    sports: data.sports,
    category: data.category,
    socials: data.socials,
  });

  return await Rider.findByIdAndUpdate(id, rider);
};

// Find rider by ID
module.exports.getRiderById = async function (id) {
  return await Rider.findById(id);
};

// Find rider by Name
module.exports.getRiderByName = async function (id) {
  return await Rider.find({});
};

// Get all
module.exports.getAllRiders = async function () {
  return await Rider.find();
};
