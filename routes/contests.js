const express = require("express");
const router = express.Router();
const ContestsController = require("../controllers/contests");
const currentUser = require("../middlewares/currentUser");

const contests = new ContestsController();

// GET ALL CONTESTS
router.get("/", contests.getAll);

// GET CONTEST BY ID
router.get("/getById/:id", contests.getById);

// GET ORGANIZER CONTESTS
router.get("/getOrganizerContests", contests.getOrganizerContests);

// GET ORGANIZER CONTESTS
router.get("/getContestsCategories", contests.getOrganizerContests);

// POST CONTEST
router.post("/", contests.createContest);

// PUT CONTEST
router.put("/:id", contests.update);

// DELETE CONTEST
router.delete("/:id", contests.deleteById);

module.exports = router;
