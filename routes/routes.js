const riders = require("./riders");
const contests = require("./contests");
const categories = require("./categories");
const rules = require("./rules");
const registrations = require("./registrations");
const results = require("./results");
const users = require("./users");
const auth = require("./auth");
const express = require("express");
const error = require("../middlewares/error");
const logger = require("../middlewares/logger");
const helmet = require("helmet");

module.exports = function (app) {
  // Middlewares
  app.use(helmet());
  app.use(express.json());
  app.use(logger);

  // Routes
  app.use("/api/riders", riders);
  app.use("/api/contests", contests);
  app.use("/api/categories", categories);
  app.use("/api/rules", rules);
  app.use("/api/registrations", registrations);
  app.use("/api/results", results);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  // Logger
  app.use(error);
};
