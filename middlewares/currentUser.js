const jwt = require("jsonwebtoken");
const functions = require("firebase-functions");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
    });
  }
  next();
};
