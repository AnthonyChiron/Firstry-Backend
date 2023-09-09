const { infoLogger } = require("./services/logger");
const express = require("express");

const app = express();

// SETUP
require("./services/logger"); // logger
require("./config/config")(); // config & env
require("./routes/routes")(app); // routes & middlewares
require("./config/db")(); // db

// PORT
const port = process.env.PORT || 80;
app.listen(port, () => infoLogger.log("info", `Server is on port ${port}!`));
