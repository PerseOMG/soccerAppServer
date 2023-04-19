const catchAsync = require("../../utils/catchAsync.util");
const AppError = require("../../utils/appError.util");
const {
  TournamentEditionStatistics,
  TournamentHistoricalStatistics,
} = require("../../models/statistics/tournamentStatistics");

exports.getStatistics = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const type = req.params.type;

  if (type !== "edition" && type !== "historical") {
    return res.status(400).json({
      status: "fail",
      message: "Please select a proper type",
    });
  }

  const tournamentStatistics =
    type === "edition"
      ? await TournamentEditionStatistics.find({ tournamentId: id })
      : await TournamentHistoricalStatistics.find({ tournamentId: id });

  console.log(tournamentStatistics);
  if (!tournamentStatistics || tournamentStatistics.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No statistics found with that ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: { tournamentStatistics },
  });
});

exports.updateStatistics = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const type = req.params.type;
  const body = req.body;

  if (type !== "edition" && type !== "historical") {
    return AppError(res, "Please select a proper type", 404);
  }

  const tournamentStatistics =
    type === "edition"
      ? await TournamentEditionStatistics.findByIdAndUpdate(id, body, {
          new: true,
          runValidators: true,
        })
      : await TournamentHistoricalStatistics.findByIdAndUpdate(id, body, {
          new: true,
          runValidators: true,
        });

  if (!teamStatistics) {
    return AppError(res, "No tour found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    data: { tournamentStatistics },
  });
});
