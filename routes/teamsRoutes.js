const express = require("express");

const router = express.Router();

const teamsController = require("../controllers/teamsController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.protect, teamsController.getAllTeams)
  .post(authController.protect, teamsController.createTeam);

router
  .route("/:id")
  .get(authController.protect, teamsController.getTeam)
  .patch(authController.protect, teamsController.updateTeam)
  .delete(authController.protect, teamsController.deleteTeam);

module.exports = router;
