const Tournament = require("../models/tournamentModel");
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");
const APIFeatures = require("../utils/apiFeatures.util");

exports.getAllTournaments = catchAsync(async(req, res, next) => {
    const features = new APIFeatures(
            Tournament.find({ userId: { $in: req.user._id } }),
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

exports.createTournament = catchAsync(async(req, res, next) => {
    const newTournament = await Tournament.create({
        ...req.body,
        userId: req.user._id,
    });

    res
        .status(201)
        .json({ status: "success", data: { tournament: newTournament } });
});

exports.getTournament = catchAsync(async(req, res, next) => {
    const id = req.params.id;

    const tournament = await Tournament.find({
        userId: { $in: req.user._id },
        _id: id,
    });

    if (!tournament) {
        return new AppError("No tour found with that ID", 404);
    }

    res.status(200).json({
        status: "success",
        data: { tournament },
    });
});

exports.updateTournament = catchAsync(async(req, res, next) => {
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

exports.deleteTournament = catchAsync(async(req, res, next) => {
    const id = req.params.id;

    const tournament = await Tournament.findByIdAndDelete(id, {
        runValidators: true,
    });

    if (!tournament) {
        return new AppError("No tour found with that ID", 404);
    }

    res.status(204).json({
        status: "success",
    });
});