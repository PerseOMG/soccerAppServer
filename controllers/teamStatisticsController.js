const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");
const TeamStatistics = require("../models/teamStatistics");

exports.createTeamStatistics = catchAsync(async(req, res, next) => {
    const newTeamStatistics = await TeamStatistics.create(req.body);

    if (!newTeamStatistics) {
        return new AppError("Not able to create statistics for this team", 404);
    }
    res
        .status(201)
        .json({ status: "success", data: { team: newTeamStatistics } });
});

exports.getTeamStatistics = catchAsync(async(req, res, next) => {
    const id = req.params.id;

    const teamStatistics = await TeamStatistics.find({ team: id });

    if (!teamStatistics) {
        return new AppError("No statistics found with that ID", 404);
    }

    res.status(200).json({
        status: "success",
        data: { teamStatistics },
    });
});

exports.updateTeamStatistics = catchAsync(async(req, res, next) => {
    const id = req.params.id;
    const body = req.body;

    const teamStatistics = await TeamStatistics.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    });

    if (!teamStatistics) {
        return new AppError("No tour found with that ID", 404);
    }

    res.status(200).json({
        status: "success",
        data: { teamStatistics },
    });
});