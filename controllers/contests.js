const CRUDController = require("./CRUD");
const { Contest, validate } = require("../models/contest");
const { Category } = require("../models/category");
const { Organizer } = require("../models/organizer");
const mongoose = require("mongoose");
const { checkPreferences } = require("joi");
const { uploadFile } = require("../services/storage");
const { subDays } = require("date-fns");
const { checkStripeAccountValidity } = require("../services/stripe");

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
      registrationEndDate: subDays(req.body.startDate, 2),
      location: req.body.location,
      sports: req.body.sports,
      enablePayment: req.body.enablePayment,
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
                pipeline: [
                  {
                    $lookup: {
                      from: "rules",
                      localField: "rules",
                      foreignField: "_id",
                      as: "rules",
                    },
                  },
                  {
                    $unwind: {
                      path: "$rules",
                      preserveNullAndEmptyArrays: true, // Utilisez ceci si vous voulez conserver les étapes sans règles
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "organizers", // nom de la collection en minuscules
          localField: "organizerId", // nom du champ dans la collection `Contest`
          foreignField: "_id", // nom du champ dans la collection `Category`
          as: "organizer", // comment vous voulez nommer le champ dans le document résultant
        },
      },
    ])
      .then((results) => {
        results[0].organizer = results[0].organizer[0];
        res.send(results[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Get organizer's contests
  getOrganizerContests = async (req, res) => {
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

    console.log(req.file);

    const imageUrl = await uploadFile(
      req.file,
      "contests/" +
        contest._id +
        "/" +
        contest.name +
        "_" +
        req.file.originalname,
      false
    );

    console.log(console.log(imageUrl));

    if (req.params.type == "logo") contest.branding.logo = imageUrl;
    if (req.params.type == "poster") contest.branding.poster = imageUrl;
    if (req.params.type == "banner") contest.branding.banner = imageUrl;

    console.log(contest.branding);

    const savedContest = contest.save();
    res.send(savedContest);
  };

  isContestPublishable = async (req, res) => {
    const contest = await this.model.findById(req.params.id);

    if (!contest) return res.status(404).send("Contest not found");

    const result = {
      isValid: true,
      errors: [],
    };

    // Check if contest has a valid stripe account
    // In case of no payment, we don't need to check
    if (contest.enablePayment) {
      const organizer = await Organizer.findById(contest.organizerId);
      if (!organizer) return res.status(404).send("Organizer not found");

      if (!organizer.stripeAccountId)
        return res.status(400).send("Organizer has no stripe account");

      if (!(await checkStripeAccountValidity(organizer.stripeAccountId))) {
        result.isValid = false;
        result.errors.push(
          "Votre compte Stripe n'est pas valide : rendez-vous dans 'Mon compte' pour le mettre à jour"
        );
      }
    }

    // Check if contest has at least one category
    const categories = await Category.find({ contestId: contest._id });
    if (categories.length == 0) {
      result.isValid = false;
      result.errors.push(
        "Il vous faut au minimum une catégorie pour publier votre contest."
      );
    }

    // Check if contest has description
    if (!contest.description) {
      result.isValid = false;
      result.errors.push("La description de votre contest est vide.");
    }

    // Check if contest has poster
    if (!contest.branding.poster) {
      result.isValid = false;
      result.errors.push("Vous devez ajouter un poster à votre contest.");
    }

    res.send(result);
  };

  publishContest = async (req, res) => {
    const contest = await this.model.findById(req.params.id);

    if (!contest) return res.status(404).send("Contest not found");

    contest.isPublished = true;

    const savedContest = contest.save();
    res.send(savedContest);
  };
};
