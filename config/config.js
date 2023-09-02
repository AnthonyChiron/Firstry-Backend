const config = require("config");
const Joi = require("joi");

module.exports = () => {
  //   if (!config.get("dbPath")) {
  //     console.error("ERROR: dbPath is not defined.");
  //     process.exit(1);
  //   }
  Joi.objectId = require("joi-objectid")(Joi);

  if (!config.get("jwtPrivateKey")) {
    console.error("ERROR: JwtPrivateKey is not defined.");
    process.exit(1);
  }
};
