const express = require("express");

const router = express.Router();

const teamsStatisticsController = require("../controllers/teamStatisticsController");
const authController = require("../controllers/authController");

router
    .route("/")
    .post(authController.protect, teamsStatisticsController.createTeamStatistics);

router
    .route("/:id")
    .get(authController.protect, teamsStatisticsController.getTeamStatistics)
    .patch(
        authController.protect,
        teamsStatisticsController.updateTeamStatistics
    );

module.exports = router;