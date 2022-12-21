const express = require("express");

const router = express.Router();

const tournamentsController = require("../controllers/tournamentsController");
const authController = require("../controllers/authController");
router
    .route("/")
    .get(authController.protect, tournamentsController.getAllTournaments)
    .post(authController.protect, tournamentsController.createTournament);

router
    .route("/:id")
    .get(authController.protect, tournamentsController.getTournament)
    .patch(authController.protect, tournamentsController.updateTournament)
    .delete(authController.protect, tournamentsController.deleteTournament);

module.exports = router;