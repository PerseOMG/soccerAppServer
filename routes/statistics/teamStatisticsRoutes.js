const express = require("express");

const router = express.Router();

const teamsStatisticsController = require("../../controllers/statistics/teamStatisticsController");
const authController = require("../../controllers/authController");

router
  .route("/:id")
  .get(authController.protect, teamsStatisticsController.getTeamStatistics)
  .patch(
    authController.protect,
    teamsStatisticsController.updateTeamStatistics
  );
module.exports = router;
