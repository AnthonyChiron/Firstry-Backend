const CRUDController = require("./CRUD");
const { Organizer, validate } = require("../models/organizer");
const { uploadFile } = require("../services/storage");
const crypto = require("crypto");
const { Contest } = require("../models/contest");

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
      "pdp/" + organizer.name + "_" + crypto.randomBytes(5).toString("hex"),
      true
    );
    organizer.photoUrl = photoUrlOrganizer;
    organizer.save();
    res.send(organizer);
  };

  // Check if organizer's contest have enable payment
  isContestPaymentEnabledByOrganizerId = async (req, res) => {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return res.status(404).send("Organizer not found");

    // get contest by organizer Id
    const contests = await Contest.find({ organizerId: organizer._id });

    const isPaymentEnabled = contests.some((contest) => contest.enablePayment);

    res.send(isPaymentEnabled);
  };

  IsOrganizerContest = async (req, res) => {
    console.log("a");
    // Check if contest is owned by organizer
    const contest = await Contest.findById(req.params.contestId);
    if (!contest) return res.status(404).send("Contest not found");

    if (contest.organizerId != req.params.organizerId)
      return res.status(403).send("Forbidden");
  };
};
