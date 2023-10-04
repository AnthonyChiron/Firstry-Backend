const express = require("express");
const router = express.Router();
const RegistrationsController = require("../controllers/registrations");

const registrations = new RegistrationsController();

// CRUD
router.get("/", registrations.getAll);
router.get("/getById/:id", registrations.getById);
router.post("/", registrations.post);
router.put("/:id", registrations.update);
router.delete("/:id", registrations.deleteById);

module.exports = router;
