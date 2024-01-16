const { infoLogger } = require("./services/logger");
const functions = require("firebase-functions");
const express = require("express");

const app = express();

// SETUP
require("dotenv").config();
require("./services/logger"); // logger
require("./config/config")(); // config & env
require("./routes/routes")(app); // routes & middlewares
require("./config/db")(); // db

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => infoLogger.log("info", `Server is on port ${port}!`));
