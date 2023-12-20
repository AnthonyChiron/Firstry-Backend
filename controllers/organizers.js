const CRUDController = require("./CRUD");
const { Organizer, validate } = require("../models/organizer");
const { uploadFile } = require("../services/storage");
const crypto = require("crypto");

module.exports = class OrganizersController extends CRUDController {
  name = "organizer";
  model = Organizer;
  validate = validate;

  updatePhoto = async (req, res) => {
    // get organizer from id
    console.log(req.params.id);
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return res.status(404).send("Organizer not found");

    const photoUrlOrganizer = await uploadFile(
      req.file,
      "pdp/" + organizer.name + "_" + crypto.randomBytes(5).toString("hex")
    );
    organizer.photoUrl = photoUrlOrganizer;
    organizer.save();
    res.send(organizer);
  };
};
