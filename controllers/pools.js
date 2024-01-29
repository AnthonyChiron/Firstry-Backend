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

  updatePoolsByStepId = async (req, res) => {
    const stepId = req.params.stepId;
    console.log("STEP ID : " + stepId);
    const step = await Step.findById(stepId);
    if (!step) return res.status(404).send("Step not found");

    // Delete all pools for this step
    console.log(stepId);
    await Pool.deleteMany({ step: stepId });

    // Create new pools for this step
    await this.createPoolInDb(req.body.poolsEntries, req.params.stepId);

    step.state = stepStateEnum.POOL_READY;
    step.save();

    res.send(await this.getPoolInDb(stepId));
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

  createPoolInDb = async (poolsEntries, stepId) => {
    let pools = [];
    for (const poolEntry of poolsEntries) {
      let pool = new Pool({
        registration: poolEntry.registrationId,
        step: stepId,
        poolNumber: poolEntry.poolNumber,
      });
      pool = await pool.save();
      pools.push(pool);
    }
    return pools;
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
    const pools = await Pool.find({ step: stepId }).sort({ score: -1 });

    // Mettre à jour les rangs
    for (let i = 0; i < pools.length; i++) {
      pools[i].rank = i + 1; // Le rang commence à 1
      await pools[i].save();
    }
  };
};
