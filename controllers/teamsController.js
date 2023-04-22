// Models
const Team = require("../models/teamModel");

// Utilities
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");
const updateById = require("./factories/updateById.factory");
const findModel = require("./factories/find.factory");

exports.getAllTeams = catchAsync(async (req, res, next) => {
  const teams = await findModel(Team);

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
  const team = updateById(Team, id, body);

  if (!team) {
    return AppError(res, "No tour found with that ID", 404);
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
    return AppError(res, "No tour found with that ID", 404);
  }

  res.status(204).json({
    status: "success",
  });
});
