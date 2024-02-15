const CRUDController = require("./CRUD");
const { Rider, validate } = require("../models/rider");
const { uploadImg } = require("../services/storage");
const crypto = require("crypto");
const mongoose = require("mongoose");

module.exports = class RidersController extends CRUDController {
  name = "rider";
  model = Rider;
  validate = validate;

  getAdminStats = async (req, res) => {
    const totalRiders = await Rider.countDocuments();

    const aWeekAgo = new Date();
    const aMonthAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    aMonthAgo.setMonth(aMonthAgo.getMonth() - 31);
    const objectIdFromWeekAgoDate = new mongoose.Types.ObjectId(
      Math.floor(aWeekAgo.getTime() / 1000).toString(16) + "0000000000000000"
    );
    const objectIdFromMonthAgoDate = new mongoose.Types.ObjectId(
      Math.floor(aWeekAgo.getTime() / 1000).toString(16) + "0000000000000000"
    );

    const totalRidersLastMonth = await Rider.countDocuments({
      _id: { $gte: objectIdFromMonthAgoDate },
    });

    const totalRidersLastWeek = await Rider.countDocuments({
      _id: { $gte: objectIdFromWeekAgoDate },
    });

    const totalRidersLastWeekPerDay = await Rider.aggregate([
      {
        $match: {
          _id: { $gte: objectIdFromWeekAgoDate },
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
    totalRidersLastWeekPerDay.forEach((entry) => {
      const dayName = daysOfWeek[entry._id];
      if (dayName) {
        resultsByDay[dayName] = entry.count;
      }
    });

    const repartitionPerSports = await Rider.aggregate([
      { $unwind: "$sports" },
      {
        $group: {
          _id: "$sports",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    console.log(totalRiders);
    console.log(totalRidersLastWeek);
    console.log(totalRidersLastWeekPerDay);
    console.log(repartitionPerSports);

    res.send({
      totalRiders,
      totalRidersLastWeek,
      totalRidersLastMonth,
      resultsByDay,
      repartitionPerSports,
    });
  };

  getFilteredRidersByPage = async (req, res) => {
    const { page = 1, limit = 10 } = req.params; // sports peut être une chaîne ou un tableau
    const { sports, name } = req.query;
    let query = {};

    // Filtrer par sports si le paramètre sports est fourni
    if (sports) {
      const sportsArray = Array.isArray(sports) ? sports : [sports]; // Assurez-vous que sports est toujours un tableau
      query.sports = { $in: sportsArray };
    }

    // Filtrer par nom (firstName ou lastName) si le paramètre name est fourni
    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } },
      ];
    }

    try {
      // Calculer le nombre total de documents pour le calcul de la pagination
      const total = await Rider.countDocuments(query);

      // Récupérer les riders avec les filtres et la pagination
      const riders = await Rider.find(query)
        .limit(limit * 1) // Convertir en nombre au cas où
        .skip((page - 1) * limit)
        .exec();

      // Renvoyer les riders et les informations de pagination
      res.json({
        riders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  updatePhoto = async (req, res) => {
    // get rider from id
    console.log(req.params.id);

    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).send("Rider not found");

    const photoUrlRider = await uploadImg(
      req.file,
      "pdp/" +
        rider.firstName +
        "_" +
        rider.lastName +
        "_" +
        new Date().toISOString(),
      true
    );
    rider.photoUrl = photoUrlRider;
    rider.save();
    res.send(rider);
  };
};
