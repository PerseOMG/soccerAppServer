const Team = require("../models/teamModel");
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");
const APIFeatures = require("../utils/apiFeatures.util");

exports.getAllTeams = catchAsync(async(req, res, next) => {
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

exports.createTeam = catchAsync(async(req, res, next) => {
    const newTeam = await Team.create(req.body);

    res.status(201).json({ status: "success", data: { team: newTeam } });
});

exports.getTeam = catchAsync(async(req, res, next) => {
    const id = req.params.id;

    const team = await Team.findById(id);

    if (!team) {
        return new AppError("No tour found with that ID", 404);
    }

    res.status(200).json({
        status: "success",
        data: { team },
    });
});

exports.updateTeam = catchAsync(async(req, res, next) => {
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
        data: { team },
    });
});

exports.deleteTeam = catchAsync(async(req, res, next) => {
    const id = req.params.id;

    const team = await Team.findByIdAndDelete(id, { runValidators: true });

    if (!team) {
        return new AppError("No tour found with that ID", 404);
    }

    res.status(204).json({
        status: "success",
    });
});

exports.topWinners = catchAsync(async(req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "totalGamesWon";
    req.query.fields = "name, logo, totalGamesWon";
    next();
});

exports.topLosers = catchAsync(async(req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "totalGamesLoosed";
    req.query.fields = "name, logo, totalGamesLoosed";
    next();
});

exports.topFinalsLoosed = catchAsync(async(req, res, next) => {
    req.query.limit = "1";
    req.query.sort = "totalLoosedFinals";
    req.query.fields = "name, logo, totalLoosedFinals";
    next();
});

exports.topWinningStreak = catchAsync(async(req, res, next) => {
    req.query.limit = "1";
    req.query.sort = "bestWinningStreak";
    req.query.fields = "name, logo, bestWinningStreak";
    next();
});

exports.topLoosingStreak = catchAsync(async(req, res, next) => {
    req.query.limit = "1";
    req.query.sort = "bestLoosingStreak";
    req.query.fields = "name, logo, bestLoosingStreak";
    next();
});