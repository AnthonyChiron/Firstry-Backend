/** @type {import("mongoose")} */
const mongoose = require("mongoose");

riderSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  birthDate: Date,
  sports: [String],
  category: String,
  socials: {
    instagram: String,
    twitter: String,
    youtube: String,
  },
});

module.exports = mongoose.model("rider", riderSchema);
