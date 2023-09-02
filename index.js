const express = require("express");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongooseConnexion = require("./config/db");
const config = require("config");
const helmet = require("helmet");
const app = express();

app.use(helmet());
app.use(express.json());

if (!config.get("jwtPrivateKey")) {
  console.error("ERROR: JwtPrivateKey is not defined.");
  process.exit(1);
}

if (!config.get("jwtPrivateKey")) {
  console.error("ERROR: JwtPrivateKey is not defined.");
  process.exit(1);
}

// ROUTES
const riders = require("./routes/riders");
const contests = require("./routes/contests");
const results = require("./routes/results");
const users = require("./routes/users");
const auth = require("./routes/auth");

app.use("/api/riders", riders);
app.use("/api/contests", contests);
app.use("/api/results", results);
app.use("/api/users", users);
app.use("/api/auth", auth);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is on port ${port}!`));
