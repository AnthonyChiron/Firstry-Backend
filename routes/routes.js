const riders = require("./riders");
const contests = require("./contests");
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
  app.use("/api/results", results);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  // Logger
  app.use(error);
};
