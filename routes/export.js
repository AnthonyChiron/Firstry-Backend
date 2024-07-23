const express = require("express");
const router = express.Router();
const ExportController = require("../controllers/export");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const exportController = new ExportController();

// CRUD
router.get("/exportRidersDataById/", exportController.exportRidersDataById);

module.exports = router;
