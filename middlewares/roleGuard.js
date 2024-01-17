const role = require("../constants/rolesEnum");

module.exports.isAdmin = function (req, res, next) {
  if (req.user.role !== role.ADMIN)
    return res.status(403).send("Acces denied. User isn't admin.");
  next();
};

module.exports.isOrganizer = function (req, res, next) {
  console.log(req.user);
  if (req.user.role !== role.ADMIN || req.user.role !== role.ORGANIZER)
    return res.status(403).send("Acces denied. User isn't organizer.");
  next();
};

module.exports.isRider = function (req, res, next) {
  if (req.user.role !== role.ADMIN || req.user.role !== role.RIDER)
    return res.status(403).send("Acces denied. User isn't rider.");
  next();
};
