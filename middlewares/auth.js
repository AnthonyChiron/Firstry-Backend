const jwt = require("jsonwebtoken");
const config = require("config");
const role = require("../constants/rolesEnum");

module.exports.auth = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Acces denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid token");
  }
};

module.exports.isAdmin = function (req, res, next) {
  console.log(req.body.model);
  if (req.user.role !== role.ADMIN)
    return res.status(403).send("Acces denied. User isn't admin.");
  next();
};

module.exports.isContest = function (req, res, next) {
  if (req.user.role !== role.ADMIN || req.user.role !== role.CONTEST)
    return res.status(403).send("Acces denied. User isn't contest.");
  next();
};

module.exports.isRider = function (req, res, next) {
  if (req.user.role !== role.ADMIN || req.user.role !== role.RIDER)
    return res.status(403).send("Acces denied. User isn't rider.");
  next();
};
