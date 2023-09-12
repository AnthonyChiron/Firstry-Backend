const riders = require("./riders");
const contests = require("./contests");
const categories = require("./categories");
const rules = require("./rules");
const registrations = require("./registrations");
const pools = require("./pools");
const users = require("./users");
const express = require("express");
const error = require("../middlewares/error");
const logger = require("../middlewares/logger");
const helmet = require("helmet");
const cors = require("cors");

module.exports = function (app) {
  // Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.use("/riders", riders);
  app.use("/contests", contests);
  app.use("/categories", categories);
  app.use("/rules", rules);
  app.use("/registrations", registrations);
  app.use("/pools", pools);
  app.use("/users", users);

  // app.use("/api/riders", riders);
  // app.use("/api/contests", contests);
  // app.use("/api/categories", categories);
  // app.use("/api/rules", rules);
  // app.use("/api/registrations", registrations);
  // app.use("/api/pools", pools);
  // app.use("/api/users", users);

  // Logger
  app.use(error);
};
