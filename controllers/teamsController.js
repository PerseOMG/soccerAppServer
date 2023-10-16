// Models
const Team = require("../models/teamModel");

// Utilities
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");

exports.getAllTeams = catchAsync(async (req, res, next) => {
  const teams = await Team.find({ userId: req.user._id });

  res.status(200).json({
    status: "success",
    results: teams.length,
    data: { teams },
  });
});

exports.createTeam = catchAsync(async (req, res, next) => {
  const checkTeam = await Team.findOne({ name: req.body.name });

  if (checkTeam) {
    return AppError(
      res,
      "Team's name already in use! Please choose another one.",
      404
    );
  }

  const newTeam = await Team.create({ ...req.body, userId: req.user._id });

  res.status(201).json({ status: "success", data: { team: newTeam } });
});

exports.getTeam = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const team = await Team.find({ _id: id, userId: req.user._id });

  if (!team) {
    return AppError(res, "No tour found with that ID", 404);
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
    return AppError(res, "No tour found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    results: 1,
    data: { team },
  });
});

exports.deleteTeam = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const team = await Team.deleteOne({ _id: id, userId: req.user._id });

  if (!team) {
    return AppError(res, "No tour found with that ID", 404);
  }

  res.status(204).json({
    status: "success",
  });
});
