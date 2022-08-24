const express = require("express");

const router = express.Router();

const teamsController = require("../controllers/teamsController");

router
    .route("/topWinners")
    .get(teamsController.topWinners, teamsController.getAllTeams);

router
    .route("/topLosers")
    .get(teamsController.topLosers, teamsController.getAllTeams);

router
    .route("/topFinalsLoosed")
    .get(teamsController.topFinalsLoosed, teamsController.getAllTeams);

router
    .route("/topWinningStreak")
    .get(teamsController.topWinningStreak, teamsController.getAllTeams);

router
    .route("/topLoosingStreak")
    .get(teamsController.topLoosingStreak, teamsController.getAllTeams);

router
    .route("/")
    .get(teamsController.getAllTeams)
    .post(teamsController.createTeam);

router
    .route("/:id")
    .get(teamsController.getTeam)
    .patch(teamsController.updateTeam)
    .delete(teamsController.deleteTeam);

module.exports = router;