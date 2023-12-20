const CRUDController = require("./CRUD");
const { Rider, validate } = require("../models/rider");
const { uploadFile } = require("../services/storage");
const crypto = require("crypto");

module.exports = class RidersController extends CRUDController {
  name = "rider";
  model = Rider;
  validate = validate;

  updatePhoto = async (req, res) => {
    // get rider from id
    console.log(req.params.id);

    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).send("Rider not found");

    const photoUrlRider = await uploadFile(
      req.file,
      "pdp/" +
        rider.firstName +
        "_" +
        rider.lastName +
        "_" +
        crypto.randomBytes(5).toString("hex")
    );
    rider.photoUrl = photoUrlRider;
    rider.save();
    res.send(rider);
  };
};
