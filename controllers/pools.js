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
};
