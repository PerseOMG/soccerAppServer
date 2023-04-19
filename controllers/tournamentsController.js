// Models
const { Tournament } = require("../models/tournamentModel");

// Utilities
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");
const APIFeatures = require("../utils/apiFeatures.util");

exports.getAllTournaments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Tournament.find({ userId: { $in: req.user._id } }, "-userId"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tournaments = await features.query;
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
      return res.status(400).json({
        status: "failed",
        error: err,
        message:
          "Something went wrong. Please choose another name for your tournament",
      });
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
    return res.status(404).json({
      status: "fail",
      message: "No tour found with that ID",
    });
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
    return new AppError("No tour found with that ID", 404);
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
    return new AppError("No tour found with that ID", 404);
  }

  res.status(204).json({
    status: "success",
  });
});
