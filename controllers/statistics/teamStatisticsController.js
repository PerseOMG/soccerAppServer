const catchAsync = require("../../utils/catchAsync.util");
const AppError = require("../../utils/appError.util");
const TeamStatistics = require("../../models/statistics/teamStatistics");
const updateById = require("../factories/updateById.factory");

exports.getTeamStatistics = catchAsync(async (req, res, next) => {
  const ids = req.params.id.split(",");
  let teamsStatistics = [];
  let errorMessage = null;

  await Promise.all(
    ids.map(async (id) => {
      await findModel(TeamStatistics, { team: id })
        .exec()
        .then((team) => {
          if (!team || team.length === 0) {
            errorMessage = `team with id ${id} does not exist`;
          } else {
            teamsStatistics.push(team);
          }
        });
    })
  );

  if (!teamsStatistics || teamsStatistics.length === 0 || errorMessage) {
    return AppError(res, errorMessage, 404);
  }

  res.status(200).json({
    status: "success",
    data: { teamsStatistics },
  });
});

exports.updateTeamStatistics = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const teamStatistics = updateById(TeamStatistics, id, body);

  if (!teamStatistics) {
    return AppError(res, "No team found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    data: { teamStatistics },
  });
});
