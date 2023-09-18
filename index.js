const { infoLogger } = require("./services/logger");
const functions = require("firebase-functions");
const express = require("express");

const app = express();

// SETUP
require("./services/logger"); // logger
require("./config/config")(); // config & env
require("./routes/routes")(app); // routes & middlewares
require("./config/db")(); // db

// PORT
if (functions.config().env.type == "dev") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => infoLogger.log("info", `Server is on port ${port}!`));
}

if (functions.config().env.type == "production")
  exports.api = functions.https.onRequest(app);
