const jwt = require("jsonwebtoken");
const functions = require("firebase-functions");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    jwt.verify(token, functions.config().env.secret_token, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  }
};
