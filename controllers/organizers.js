const CRUDController = require("./CRUD");
const { Organizer, validate } = require("../models/organizer");
const { uploadFile } = require("../services/storage");
const crypto = require("crypto");
const { Contest } = require("../models/contest");
const mongoose = require("mongoose");

module.exports = class OrganizersController extends CRUDController {
  name = "organizer";
  model = Organizer;
  validate = validate;

  getAdminStats = async (req, res) => {
    const totalOrganizers = await Organizer.countDocuments();

    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    const aMonthAgo = new Date();
    aMonthAgo.setDate(aWeekAgo.getDate() - 31);
    const objectIdFromAWeekDate = new mongoose.Types.ObjectId(
      Math.floor(aWeekAgo.getTime() / 1000).toString(16) + "0000000000000000"
    );
    const objectIdFromAMonthDate = new mongoose.Types.ObjectId(
      Math.floor(aMonthAgo.getTime() / 1000).toString(16) + "0000000000000000"
    );

    const totalOrganizersLastWeek = await Organizer.countDocuments({
      _id: { $gte: objectIdFromAWeekDate },
    });
    const totalOrganizersLastMonth = await Organizer.countDocuments({
      _id: { $gte: objectIdFromAMonthDate },
    });

    const organizersLastWeekPerDay = await Organizer.aggregate([
      {
        $match: {
          _id: { $gte: objectIdFromAWeekDate },
        },
      },
      {
        $group: {
          _id: {
            $dayOfWeek: { $toDate: "$_id" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const daysOfWeek = {
      1: "Dimanche",
      2: "Lundi",
      3: "Mardi",
      4: "Mercredi",
      5: "Jeudi",
      6: "Vendredi",
      7: "Samedi",
    };

    // Créez un objet de résultat pour chaque jour de la semaine
    let resultsByDay = {
      Dimanche: 0,
      Lundi: 0,
      Mardi: 0,
      Mercredi: 0,
      Jeudi: 0,
      Vendredi: 0,
      Samedi: 0,
    };

    // Mettez à jour le compte basé sur les données récupérées
    organizersLastWeekPerDay.forEach((entry) => {
      const dayName = daysOfWeek[entry._id];
      if (dayName) {
        resultsByDay[dayName] = entry.count;
      }
    });

    res.send({
      totalOrganizers,
      totalOrganizersLastMonth,
      totalOrganizersLastWeek,
      resultsByDay,
    });
  };

  updatePhoto = async (req, res) => {
    // get organizer from id
    console.log(req.params.id);
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return res.status(404).send("Organizer not found");

    const photoUrlOrganizer = await uploadFile(
      req.file,
      "pdp/" + organizer.name + "_" + crypto.randomBytes(5).toString("hex"),
      false
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
