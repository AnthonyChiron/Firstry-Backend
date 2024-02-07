const CRUDController = require("./CRUD");
const { Rider, validate } = require("../models/rider");
const { uploadFile } = require("../services/storage");
const crypto = require("crypto");

module.exports = class RidersController extends CRUDController {
  name = "rider";
  model = Rider;
  validate = validate;

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

    const photoUrlRider = await uploadFile(
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
