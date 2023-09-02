const { httpLogger } = require("../services/logger");

module.exports = (req, res, next) => {
  httpLogger.log("http", `(api call) : ${JSON.stringify(req.body)}`);
  next();
};
