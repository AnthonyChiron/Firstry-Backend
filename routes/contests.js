const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contests");

// GET ALL CONTESTS
router.get("/", contestController.getAllContests);

// GET CONTEST BY ID
router.get("/:id", contestController.getContestById);

// POST CONTEST
router.post("/", contestController.createContest);

// DELETE CONTEST
router.delete("/:id", contestController.deleteContestById);

// PUT CONTEST
router.put("/:id", contestController.updateContest);

module.exports = router;
