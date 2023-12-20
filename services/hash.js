const bcrypt = require("bcrypt");

module.exports.encrypt = async (password) => {
  console.log(password);
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  password = await bcrypt.hash(password, salt);
  console.log(password);
  return password;
};

module.exports.isValid = async (givenPassword, registeredPassword) => {
  return bcrypt.compare(givenPassword, registeredPassword);
};
