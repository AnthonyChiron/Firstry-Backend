const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImportController = require("../controllers/import");

const upload = multer({ storage: multer.memoryStorage() });
const importController = new ImportController();

// CRUD
router.post(
  "/importRidersOnContest/:contestId",
  upload.single("file"),
  importController.importRidersOnContest
);

router.get("/reset", importController.reset);

module.exports = router;
