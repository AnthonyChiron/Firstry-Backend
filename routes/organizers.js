const express = require("express");
const router = express.Router();
const OrganizersController = require("../controllers/organizers");

const organizers = new OrganizersController();

// CRUD
router.get("/", organizers.getAll);
router.get("/getById/:id", organizers.getById);
router.post("/", organizers.post);
router.delete("/:id", organizers.deleteById);
router.put("/:id", organizers.update);

module.exports = router;
