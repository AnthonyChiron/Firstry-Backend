const { errorLogger } = require("../services/logger");

// Gestion des erreurs async (throw error, catch...)
module.exports = (err, req, res, next) => {
  if (err)
    errorLogger.log({
      level: "error",
      message: err,
    });
  next();
};
