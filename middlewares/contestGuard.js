const mongoose = require("mongoose");

module.exports.isOrganizerContest = function (req, res, next) {
  if (req.user.role !== role.ADMIN)
    return res.status(403).send("Acces denied. User isn't admin.");
  next();
};
