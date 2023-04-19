// Models
const Team = require("../models/teamModel");

// Utilities
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");
const APIFeatures = require("../utils/apiFeatures.util");

exports.getAllTeams = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Team.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const teams = await features.query;

  res.status(200).json({
    status: "success",
    results: teams.length,
    data: { teams },
  });
});

exports.createTeam = catchAsync(async (req, res, next) => {
  const newTeam = await Team.create({ ...req.body, userId: req.user._id });

  res.status(201).json({ status: "success", data: { team: newTeam } });
});

exports.getTeam = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const team = await Team.find({ _id: id, userId: req.user._id });

  if (!team) {
    return new AppError("No tour found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    results: 1,
    data: { teams },
  });
});

exports.updateTeam = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const team = await Team.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!team) {
    return new AppError("No tour found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    results: 1,
    data: { teams },
  });
});

exports.deleteTeam = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const team = await Team.deleteOne({ _id: id, userId: req.user._id });

  if (!team) {
    return new AppError("No tour found with that ID", 404);
  }

  res.status(204).json({
    status: "success",
  });
});
