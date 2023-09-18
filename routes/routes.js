const riders = require("./riders");
const contests = require("./contests");
const categories = require("./categories");
const rules = require("./rules");
const auth = require("./auth");
const registrations = require("./registrations");
const pools = require("./pools");
const users = require("./users");
const organizers = require("./organizers");
const express = require("express");
const error = require("../middlewares/error");
const logger = require("../middlewares/logger");
const helmet = require("helmet");
const cors = require("cors");
const functions = require("firebase-functions");

module.exports = function (app) {
  // Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(logger);

  if (functions.config().env.type == "dev") {
    app.use("/api/riders", riders);
    app.use("/api/auth", auth);
    app.use("/api/contests", contests);
    app.use("/api/categories", categories);
    app.use("/api/rules", rules);
    app.use("/api/registrations", registrations);
    app.use("/api/pools", pools);
    app.use("/api/users", users);
    app.use("/api/organizers", organizers);
  }

  if (functions.config().env.type == "production") {
    app.use("/riders", riders);
    app.use("/auth", auth);
    app.use("/contests", contests);
    app.use("/categories", categories);
    app.use("/rules", rules);
    app.use("/registrations", registrations);
    app.use("/pools", pools);
    app.use("/users", users);
  }
  // Logger
  app.use(error);
};
