// Models
const { Tournament } = require("../models/tournamentModel");

// Utilities
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");

exports.getAllTournaments = catchAsync(async (req, res, next) => {
  const tournaments = await Tournament.find(
    { userId: { $in: req.user._id } },
    "-userId"
  );
  res.status(200).json({
    status: "success",
    results: tournaments.length,
    data: { tournaments },
  });
});

exports.createTournament = catchAsync(async (req, res, next) => {
  const { teams } = req.body;

  const tournament = new Tournament({
    name: req.body.name,
    teams,
    logo: req.body.logo,
    userId: req.user._id,
    editionStatistics: { currentEdition: 0 },
    historicalStatistics: { currentEdition: 0 },
  });

  tournament.save((err, newTournament) => {
    if (err) {
      return AppError(
        res,
        "Something went wrong. Please choose another name for your tournament",
        400
      );
    }
    res.status(201).json({
      status: "success",
      results: 1,
      data: { tournament: newTournament },
    });
  });
});

exports.getTournament = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const tournament = await Tournament.find({
    userId: { $in: req.user._id },
    _id: id,
  });

  if (!tournament || tournament.length === 0) {
    return AppError(res, "No tournament found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    results: 1,
    data: { tournament },
  });
});

exports.updateTournament = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const tournament = await Tournament.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!tournament) {
    return AppError(res, "No tour found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    data: { tournament },
  });
});

exports.deleteTournament = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const tournament = await Tournament.deleteOne(
    { _id: id, userId: { $in: req.user._id } },
    {
      runValidators: true,
    }
  );

  if (!tournament) {
    return AppError(res, "No tour found with that ID", 404);
  }

  res.status(204).json({
    status: "success",
  });
});
