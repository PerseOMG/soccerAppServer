const express = require("express");

const router = express.Router();

const tournamentStatisticsController = require("../../controllers/statistics/tournamentsStatisticsController");
const authController = require("../../controllers/authController");

router
  .route("/:type/:id")
  .get(authController.protect, tournamentStatisticsController.getStatistics)
  .patch(
    authController.protect,
    tournamentStatisticsController.updateStatistics
  );

module.exports = router;
