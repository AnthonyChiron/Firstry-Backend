const mongoose = require("mongoose");
const { infoLogger } = require("../services/logger");

module.exports = () => {
  mongoose
    .connect(process.env.DB_HOST)
    .then(() => infoLogger.log("info", "Connected to MongoDB"));
};
