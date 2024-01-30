const CRUDController = require("./CRUD");
const { Pool, validate } = require("../models/pool");
const { Step } = require("../models/step");

module.exports = class PoolsController extends CRUDController {
  name = "pool";
  model = Pool;
  validate = validate;

  getPoolsByStepId = async (req, res) => {
    // Include registrations
    const pools = await this.model
      .find({ step: req.params.stepId })
      .populate({
        path: "registration", // Chemin vers le champ 'registration'
        populate: {
          path: "rider", // Chemin à partir de 'registration' vers 'rider'
          model: "Riders", // Nom du modèle pour 'rider', si nécessaire
        },
      })
      .sort("poolNumber");

    res.send(pools);
  };

  getFinalPoolsByStepId = async (req, res) => {
    // Include registrations
    const pools = await this.model
      .find({ step: req.params.stepId, isQualified: true })
      .populate({
        path: "registration", // Chemin vers le champ 'registration'
        populate: {
          path: "rider", // Chemin à partir de 'registration' vers 'rider'
          model: "Riders", // Nom du modèle pour 'rider', si nécessaire
        },
      })
      .sort("rank");

    // Get 8 other best riders by rank after qualified riders
    const otherBestRiders = await this.model
      .find({ step: req.params.stepId, isQualified: false, isMissing: false })
      .populate({
        path: "registration", // Chemin vers le champ 'registration'
        populate: {
          path: "rider", // Chemin à partir de 'registration' vers 'rider'
          model: "Riders", // Nom du modèle pour 'rider', si nécessaire
        },
      })
      .sort("rank")
      .limit(8);

    res.send(pools);
  };

  createPools = async (req, res) => {
    const stepId = req.params.stepId;

    await this.createPoolInDb(req.body.poolsEntries, req.params.stepId);

    res.send(await this.getPoolInDb(stepId));
  };

  createPoolInDb = async (poolsEntries, stepId) => {
    let pools = [];
    for (const poolEntry of poolsEntries) {
      let pool = new Pool({
        registration: poolEntry.registrationId,
        step: stepId,
        poolNumber: poolEntry.poolNumber,
        isMissing: poolEntry.isMissing ? poolEntry.isMissing : false,
      });
      console.log(pool);
      pool = await pool.save();
      pools.push(pool);
    }
    return pools;
  };

  updatePoolsByStepId = async (req, res) => {
    const stepId = req.params.stepId;

    // Mise à jour des pools pour cette étape
    await this.updatePoolsInDb(req.body.poolsEntries, stepId);

    res.send(await this.getPoolInDb(stepId));
  };

  updatePoolsInDb = async (poolsEntries, stepId) => {
    let updatedPools = [];
    for (const poolEntry of poolsEntries) {
      // Recherche d'une pool existante
      let pool = await Pool.findOne({
        registration: poolEntry.registrationId,
        step: stepId,
      });

      if (pool) {
        // Mise à jour de la pool existante
        pool.poolNumber = poolEntry.poolNumber;
        pool.isMissing = poolEntry.isMissing ? poolEntry.isMissing : false;
        pool = await pool.save();
      } else {
        // Création d'une nouvelle pool
        pool = new Pool({
          registration: poolEntry.registrationId,
          step: stepId,
          poolNumber: poolEntry.poolNumber,
          isMissing: poolEntry.isMissing ? poolEntry.isMissing : false,
        });
        pool = await pool.save();
      }
      updatedPools.push(pool);
    }

    const step = await Step.findById(stepId);

    await this.updatePoolRank(stepId, step.ridersQualifiedCount);
    return updatedPools;
  };

  updatePoolResult = async (req, res) => {
    const stepId = req.params.stepId;

    const step = await Step.findById(stepId);

    for (const poolEntry of req.body.poolsEntries) {
      const pool = await Pool.findById(poolEntry._id);
      if (!pool) {
        return res.status(404).send("Pool not found");
      }
      pool.score = poolEntry.score;
      await pool.save();
    }

    await this.updatePoolRank(stepId, step.ridersQualifiedCount);

    res.send(await this.getPoolInDb(stepId));
  };

  updatePoolRank = async (stepId, qualifiedNumber) => {
    // Récupérer et trier les pools par score décroissant
    const pools = await Pool.find({ step: stepId, isMissing: false }).sort({
      score: -1,
    });

    console.log(pools);
    // Mettre à jour les rangs
    for (let i = 0; i < pools.length; i++) {
      if (i < qualifiedNumber) pools[i].isQualified = true;
      else pools[i].isQualified = false;
      pools[i].rank = i + 1; // Le rang commence à 1
      await pools[i].save();
    }
  };

  getPoolInDb = async (stepId) => {
    const pools = await this.model
      .find({ step: stepId })
      .populate({
        path: "registration", // Chemin vers le champ 'registration'
        populate: {
          path: "rider", // Chemin à partir de 'registration' vers 'rider'
          model: "Riders", // Nom du modèle pour 'rider', si nécessaire
        },
      })
      .sort("poolNumber");
    return pools;
  };

  publishResult = async (req, res) => {
    const stepId = req.params.stepId;

    // Get step id
    const step = await Step.findById(stepId);
    if (!step) return res.status(404).send("Step not found");
    step.isResultPublished = true;
    await step.save();

    res.send(await this.getPoolInDb(stepId));
  };

  unpublishResult = async (req, res) => {
    const stepId = req.params.stepId;

    // Get step id
    const step = await Step.findById(stepId);
    if (!step) return res.status(404).send("Step not found");
    step.isResultPublished = false;
    await step.save();

    res.send(await this.getPoolInDb(stepId));
  };
};
