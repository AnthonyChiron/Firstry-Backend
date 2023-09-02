const mongoose = require("mongoose");
const { infoLogger } = require("../services/logger");

module.exports = () => {
  mongoose
    .connect(
      "mongodb+srv://admin:1s6PFlJu3RZLK4vf@test.8llgtn5.mongodb.net/firstry"
    )
    .then(() => infoLogger.log("info", "Connected to MongoDB"));
};
