const riders = require("./riders");
const contests = require("./contests");
const categories = require("./categories");
const rules = require("./rules");
const auth = require("./auth");
const registrations = require("./registrations");
const pools = require("./pools");
const steps = require("./steps");
const users = require("./users");
const payment = require("./payment");
const organizers = require("./organizers");
const express = require("express");
const error = require("../middlewares/error");
const logger = require("../middlewares/logger");
const helmet = require("helmet");
const cors = require("cors");
const functions = require("firebase-functions");
const bodyParser = require("body-parser");
const currentUser = require("../middlewares/currentUser");
const stripeWebhook = require("../webhooks/stripe");

const corsOptions = {
  origin: true,
};

module.exports = function (app) {
  // Middlewares
  app.use(helmet());
  app.use(cors(corsOptions));
  app.post(
    "/stripe",
    express.raw({ type: "application/json" }),
    stripeWebhook.handler
  );
  app.use(express.json());
  app.use(logger);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(currentUser);

  app.use("/api/riders", riders);
  app.use("/api/auth", auth);
  app.use("/api/contests", contests);
  app.use("/api/categories", categories);
  app.use("/api/rules", rules);
  app.use("/api/registrations", registrations);
  app.use("/api/pools", pools);
  app.use("/api/steps", steps);
  app.use("/api/users", users);
  app.use("/api/organizers", organizers);
  app.use("/api/payment", payment);

  // Logger
  app.use(error);
};
