/** @type {import("mongoose").Model} */
const Rider = require("../models/riders");

module.exports.createRider = async function (data) {
  const rider = new Rider({
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    birthDate: data.birthDate,
    sports: data.sports,
    category: data.category,
    socials: data.socials,
    // socials: {
    //   instagram: data.twitter.instagram,
    //   twitter: data.socials.twitter,
    //   youtube: data.socials.youtube,
    // },
  });

  return await rider.save();
};

// Delete Rider
module.exports.deleteRiderById = async function (id) {
  return await Rider.findByIdAndDelete(id);
};

// Update rider
module.exports.findRiderById = async function (id) {
  return await Rider.findById(id);
};

// Find rider by ID

// Find rider by Name

// Get all
module.exports.getAllRiders = async function () {
  return await Rider.find();
};
