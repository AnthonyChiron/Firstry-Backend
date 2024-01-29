const CRUDController = require("./CRUD");
const { Pool, validate } = require("../models/pool");
const { Step } = require("../models/step");
const stepStateEnum = require("../constants/stepStateEnum");

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

  createPools = async (req, res) => {
    const stepId = req.params.stepId;
    const step = await Step.findById(stepId);
    if (!step) return res.status(404).send("Step not found");

    await this.createPoolInDb(req.body.poolsEntries, req.params.stepId);

    step.state = stepStateEnum.POOL_READY;
    step.save();

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
      pool = await pool.save();
      pools.push(pool);
    }
    return pools;
  };

  updatePoolsByStepId = async (req, res) => {
    const stepId = req.params.stepId;
    console.log("STEP ID : " + stepId);
    const step = await Step.findById(stepId);
    if (!step) return res.status(404).send("Step not found");

    // Mise à jour des pools pour cette étape
    const updatedPools = await this.updatePoolsInDb(
      req.body.poolsEntries,
      stepId
    );

    step.state = stepStateEnum.POOL_READY;
    step.save();

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

    await this.updatePoolRank(stepId);
    return updatedPools;
  };

  updatePoolResult = async (req, res) => {
    const stepId = req.params.stepId;

    await req.body.poolsEntries.forEach(async (poolEntry) => {
      const pool = await Pool.findById(poolEntry._id);
      if (!pool) return res.status(404).send("Pool not found");
      pool.score = poolEntry.score;
      await pool.save();
    });

    // Get step id
    const step = await Step.findById(stepId);
    if (!step) return res.status(404).send("Step not found");
    step.state = stepStateEnum.RESULT_PENDING;
    await step.save();

    await this.updatePoolRank(stepId);

    res.send(await this.getPoolInDb(stepId));
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

  updatePoolRank = async (stepId) => {
    // Récupérer et trier les pools par score décroissant
    const pools = await Pool.find({ step: stepId, isMissing: false }).sort({
      score: -1,
    });

    console.log(pools);
    // Mettre à jour les rangs
    for (let i = 0; i < pools.length; i++) {
      pools[i].rank = i + 1; // Le rang commence à 1
      await pools[i].save();
    }
  };
};
