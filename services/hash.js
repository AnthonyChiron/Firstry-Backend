const bcrypt = require("bcrypt");

module.exports.encrypt = async (password) => {
  const salt = await bcrypt.genSalt(15);
  password = await bcrypt.hash(password, salt);
  return password;
};

module.exports.isValid = async (givenPassword, registeredPassword) => {
  return bcrypt.compare(givenPassword, registeredPassword);
};
