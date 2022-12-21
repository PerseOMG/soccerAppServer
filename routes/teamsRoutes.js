const express = require("express");

const router = express.Router();

const teamsController = require("../controllers/teamsController");
const authController = require("../controllers/authController");

router
    .route("/topWinners")
    .get(
        authController.protect,
        teamsController.topWinners,
        teamsController.getAllTeams
    );

router
    .route("/topLosers")
    .get(
        authController.protect,
        teamsController.topLosers,
        teamsController.getAllTeams
    );

router
    .route("/topFinalsLoosed")
    .get(
        authController.protect,
        teamsController.topFinalsLoosed,
        teamsController.getAllTeams
    );

router
    .route("/topWinningStreak")
    .get(
        authController.protect,
        teamsController.topWinningStreak,
        teamsController.getAllTeams
    );

router
    .route("/topLoosingStreak")
    .get(
        authController.protect,
        teamsController.topLoosingStreak,
        teamsController.getAllTeams
    );

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