const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users");
const functions = require("firebase-functions");

const users = new UsersController();

// CRUD
router.get("/", users.getAll);
router.get("/getById/:id", users.getById);
router.post("/", users.register);
router.delete("/:id", users.deleteById);
router.put("/:id", users.update);

// UPDATE EMAIL AND PASSWORD
router.post("/updateEmail/:id", users.updateEmail);
router.post("/updatePassword/:id", users.updatePassword);

// VALIDATE NEW EMAIL AND NEW PASSWORD
router.post("/validateNewEmail/:token", users.validateNewEmail);
router.post("/validateNewPassword/:token", users.validateNewPassword);

// RESET PASSWORD
router.post("/resetPassword", users.resetPassword);
router.post("/resetPassword/:token", users.validateResetPassword);
router.post("/checkResetPasswordToken/:token", users.checkResetPasswordToken);

router.post("/isEmailAvailable", users.isEmailAvailable);

module.exports = router;
