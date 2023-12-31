const CRUDController = require("./CRUD");
const { Contest, validate } = require("../models/contest");
const { Category } = require("../models/category");
const { Organizer } = require("../models/organizer");
const mongoose = require("mongoose");
const { checkPreferences } = require("joi");
const { uploadFile } = require("../services/storage");

module.exports = class ContestsController extends CRUDController {
  name = "contest";
  model = Contest;
  validate = validate;

  // Create Contest and add it to the organizer
  createContest = async (req, res) => {
    const { error } = this.validate(req.body);
    console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    console.log(req.body);
    console.log(req.user);

    const contest = new Contest({
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
      sports: req.body.sports,
      organizerId: req.user.organizerId,
    });

    try {
      const savedContest = await contest.save();
      res.send(savedContest);
    } catch (err) {
      res.status(400).send(err);
    }
  };

  // Get contest by Id and add categories
  getContestById = async (req, res) => {
    Contest.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id), // Assurez-vous que la valeur est un ObjectId
        },
      },
      {
        $lookup: {
          from: "categories", // nom de la collection en minuscules
          localField: "_id", // nom du champ dans la collection `Contest`
          foreignField: "contestId", // nom du champ dans la collection `Category`
          as: "categories", // comment vous voulez nommer le champ dans le document résultant
          pipeline: [
            {
              $lookup: {
                from: "steps", // Assurez-vous que c'est le nom correct de votre collection de steps
                localField: "_id", // Ici, nous utilisons l'ID de la catégorie
                foreignField: "categoryId", // Assurez-vous que c'est le champ correct dans la collection `steps`
                as: "steps",
              },
            },
          ],
        },
      },
    ])
      .then((results) => {
        res.send(results[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Get organizer's contests
  getOrganizerContests = async (req, res) => {
    console.log(req.user.organizerId);
    Contest.aggregate([
      {
        $match: {
          organizerId: new mongoose.Types.ObjectId(req.user.organizerId), // Assurez-vous que la valeur est un ObjectId
        },
      },
      {
        $lookup: {
          from: "categories", // nom de la collection en minuscules
          localField: "_id", // nom du champ dans la collection `Contest`
          foreignField: "contestId", // nom du champ dans la collection `Category`
          as: "categories", // comment vous voulez nommer le champ dans le document résultant
        },
      },
    ])
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getContests = async (req, res) => {
    Contest.aggregate([
      {
        $lookup: {
          from: "categories", // nom de la collection en minuscules
          localField: "_id", // nom du champ dans la collection `Contest`
          foreignField: "contestId", // nom du champ dans la collection `Category`
          as: "categories", // comment vous voulez nommer le champ dans le document résultant
        },
      },
    ])
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  uploadBrandImage = async (req, res) => {
    const contest = await this.model.findById(req.params.id);

    if (!contest) return res.status(404).send("Contest not found");

    const imageUrl = await uploadFile(
      req.file,
      "contests/" +
        contest._id +
        "/" +
        contest.name +
        "_" +
        req.file.originalname
    );

    console.log(req.file.originalname);

    if (req.file.originalname.includes("logo"))
      contest.branding.logo = imageUrl;
    if (req.file.originalname.includes("banner"))
      contest.branding.banner = imageUrl;
    if (req.file.originalname.includes("poster"))
      contest.branding.poster = imageUrl;

    const savedContest = contest.save();
    res.send(savedContest);
  };
};
