module.exports.isAuth = function (req, res, next) {
  console.log(req.user);
  if (!req.user)
    return res.status(403).send("Acces denied. User isn't connected.");
  next();
};
