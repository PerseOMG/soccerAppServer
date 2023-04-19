const catchAsync = require("../../utils/catchAsync.util");
const AppError = require("../../utils/appError.util");
const {
  TournamentEditionStatistics,
  TournamentHistoricalStatistics,
} = require("../../models/statistics/tournamentStatistics");
const updateById = require("../factories/updateById");

exports.getStatistics = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const type = req.params.type;

  if (type !== "edition" && type !== "historical") {
    return AppError(res, "Please select a proper type", 400);
  }

  const tournamentStatistics = findStatistics(
    type === "edition"
      ? TournamentEditionStatistics
      : TournamentHistoricalStatistics,
    id
  );

  if (!tournamentStatistics || tournamentStatistics.length === 0) {
    return AppError(res, "No statistics found with that ID", 404);
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

  const tournamentStatistics = updateById(
    type === "edition"
      ? TournamentEditionStatistics
      : TournamentHistoricalStatistics,
    id,
    body
  );

  if (!teamStatistics) {
    return AppError(res, "No tour found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    data: { tournamentStatistics },
  });
});

const findStatistics = async (Model, id) => {
  return await Model.find({ tournamentId: id });
};
