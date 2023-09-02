const User = require("../models/user");

module.exports = function authMiddleware(req, res, next) {
  next();
};
