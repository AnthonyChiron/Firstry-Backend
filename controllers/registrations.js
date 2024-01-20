const CRUDController = require("./CRUD");
const { Registration, validate } = require("../models/registration");
const { registrationState } = require("../constants/registrationEnum");
const mongoose = require("mongoose");
const c = require("config");

module.exports = class CategoriesController extends CRUDController {
  name = "registration";
  model = Registration;
  validate = validate;

  getRegistrationsByContestId = async (req, res) => {
    Registration.aggregate([
      {
        $lookup: {
          from: "categories", // Le nom de votre collection de catégories dans MongoDB
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "riders", // Le nom de votre collection de catégories dans MongoDB
          localField: "rider",
          foreignField: "_id",
          as: "rider",
        },
      },
      { $unwind: "$rider" },
      {
        $lookup: {
          from: "contests", // Le nom de votre collection de contests dans MongoDB
          localField: "category.contestId",
          foreignField: "_id",
          as: "contest",
        },
      },
      { $unwind: "$contest" },
      {
        $match: {
          "contest._id": new mongoose.Types.ObjectId(req.params.contestId), // Remplacer 'contestId' par l'ID du contest concerné
        },
      },
      {
        $project: {
          _id: 1,
          rider: 1,
          category: 1,
          rider: 1,
          state: 1,
          contest: {
            _id: 1,
            name: 1,
            startDate: 1,
            endDate: 1,
            location: 1,
            sports: 1,
          },
        },
      },
    ])
      .then((result) => {
        console.log(result); // Les registrations avec les infos de Category et Contest
        res.send(result);
      })
      .catch((err) => {
        console.error(err); // Gérer les erreurs
      });
  };

  getRiderRegistrations = async (req, res) => {
    Registration.aggregate([
      {
        $match: {
          rider: new mongoose.Types.ObjectId(req.params.riderId), // Remplacer 'riderId' par l'ID du rider concerné
        },
      },
      {
        $lookup: {
          from: "categories", // Le nom de votre collection de catégories dans MongoDB
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "contests", // Le nom de votre collection de contests dans MongoDB
          localField: "category.contestId",
          foreignField: "_id",
          as: "contest",
        },
      },
      { $unwind: "$contest" },
      {
        $project: {
          _id: 1,
          rider: 1,
          category: 1,
          state: 1,
          contest: {
            _id: 1,
            name: 1,
            startDate: 1,
            endDate: 1,
            registrationEndDate: 1,
            location: 1,
            sports: 1,
          },
        },
      },
    ])
      .then((result) => {
        console.log(result); // Les registrations avec les infos de Category et Contest
        res.send(result);
      })
      .catch((err) => {
        console.error(err); // Gérer les erreurs
      });
  };

  isRiderRegisteredToContest = async (req, res) => {
    try {
      // Trouver toutes les registrations pour le rider donné
      const registrations = await Registration.find({
        rider: req.params.riderId,
      }).populate("category");

      // Vérifier si l'une des registrations est liée au contestId donné
      res.send(
        registrations.some(
          (registration) =>
            registration.category.contestId == req.params.contestId
        )
      );
    } catch (err) {
      console.error("Error in isRiderRegisteredToContest: ", err);
      res.send(false);
    }
  };

  pendingApprovalRiderRegistration = async (req, res) => {
    console.log("pendingApprovalRiderRegistration");
    try {
      res.send(
        this.changeState(
          req.params.riderId,
          req.params.categoryId,
          registrationState.PENDING_APPROVAL
        )
      );
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  cancelRiderRegistration = async (req, res) => {
    try {
      res.send(
        this.changeStateByRegistrationId(
          req.params.registrationId,
          registrationState.CANCELLED_AND_REFUNDED
        )
      );
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  validRiderRegistration = async (req, res) => {
    try {
      res.send(
        this.changeStateByRegistrationId(
          req.params.registrationId,
          registrationState.VALID
        )
      );
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  refuseRiderRegistration = async (req, res) => {
    try {
      res.send(
        this.changeStateByRegistrationId(
          req.params.registrationId,
          registrationState.REFUSED
        )
      );
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  paymentFailedRiderRegistration = async (req, res) => {
    try {
      res.send(
        this.changeState(
          req.params.riderId,
          req.params.categoryId,
          registrationState.PAYMENT_FAILED
        )
      );
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  async changeState(riderId, categoryId, registrationState) {
    const registration = await Registration.findOne({
      rider: riderId,
      category: categoryId,
    });

    registration.state = registrationState;

    await registration.save();

    return registration;
  }

  async changeStateByRegistrationId(registrationId, registrationState) {
    const registration = await Registration.findById(registrationId);

    registration.state = registrationState;

    await registration.save();

    return registration;
  }
};
