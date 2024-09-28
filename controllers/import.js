const { Contest } = require("../models/contest");
const { Pool } = require("../models/pool");
const {
  verifyRiderHeaders,
  importRidersFromXlsx,
} = require("../services/import");

module.exports = class ImportController {
  importRidersOnContest = async (req, res) => {
    try {
      const contestId = req.params.contestId;
      const contest = await Contest.findById(contestId);
      if (!contest) return res.status(404).send("Contest not found");

      if (!verifyRiderHeaders(req.file.buffer)) {
        return res.status(400).send("Invalid file format");
      }
      console.log("Importing riders on contest...");
      await importRidersFromXlsx(req.file.buffer, contestId);

      res.status(200).send("Riders imported successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error importing riders on contest");
    }
  };

  reset = async (req, res) => {
    console.log("Resetting pools...");
    const deleted = await Pool.deleteMany({ step: "66d70b82a39f6b5888b9fba2" });
    console.log(deleted);
  };
};
