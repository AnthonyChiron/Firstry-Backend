const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://admin:1s6PFlJu3RZLK4vf@test.8llgtn5.mongodb.net/firstry"
  )
  .then(() => console.log("Connecté !"))
  .catch((err) => console.log(err));

module.exports = mongoose.connection;
